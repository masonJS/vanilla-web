const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const cpUpload = upload.fields([{name: 'main_img'}, {name: 'sub_img', maxCount: 5}]);
const awsS3 = require('../../../module/back/util/fileUpload.js');

app.get('/advertiser/adv_campaign_registration', (req, res) => {
    // if (req.session.user.auth !== 'advertiser') return res.redirect('/');

    res.send(TMPL.layout.hnmf({
        css: `
            <link rel="stylesheet" href="/front/css/advertiser/adv_common_campaign.css" />
        `,
        header: TMPL.layout.advHeader(),
        nav: TMPL.layout.advNav(),
        main: `
            <div id="main">
                <div class="container">
                    <div class="breadcrumbs">
                        <a>홈</a>
                        <span>캠페인 등록</span>
                    </div>
                    <div class="camp_wrap">
                        <form id="camp_form" action="/api/advertiser/adv_campaign_registration" method="post" enctype="multipart/form-data" >
                            <div class="input_wrap">
                                <label for="sns_type">SNS 타입<sup>*</sup></label>
                                <select name="sns_type" class="sns_type">
                                    <option value="">SNS</option>
                                    <option value="instagram">인스타그램</option>
                                    <option value="facebook">페이스북</option>
                                    <option value="blog">블로그</option>
                                    <option value="youtube">유튜브</option>
                                </select>
                            </div>
                            <div class="input_wrap">
                                <label for="sex">성별<sup>*</sup></label>
                                <select name="sex" class="sex">
                                    <option value="">성별</option>
                                    <option value="man">남자</option>
                                    <option value="woman">여자</option>
                                </select>
                            </div>
                            <div class="input_wrap">
                                <label for="age">연령대<sup>*</sup></label>
                                <select name="age" class="age">
                                    <option value="">연령대</option>
                                    <option value="teens">10대</option>
                                    <option value="twenties">20대</option>
                                    <option value="thirties">30대</option>
                                    <option value="fourties">40대</option>
                                </select>
                            </div>
                             <div class="input_wrap ">
                                <label for="camp_name">캠페인 명<sup>*</sup></label>
                                <input type="text" name="camp_name" class="camp_name">
                            </div>
                            <div class="input_wrap">
                                <label for="category">카테고리<sup>*</sup></label>
                                <select name="category" class="category">
                                    <option value="">선택</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="cosmetic">Cosmetic</option>
                                    <option value="living">Living</option>
                                    <option value="food">Food</option>
                                </select>
                            </div>
                            <div class="input_wrap">
                                <label for="main_img">대표 이미지<sup>*</sup></label>
                                <input type="file" name="main_img" accept="image/*" class="main_img">
                                <img id="campaign_image" src="#" width="70" alt="your image" />
                                <p> 메인 페이지에 노출될 대표 이미지 </p>
                            </div>
                            <div class="input_wrap">
                                <label for="sub_img">상세 이미지<sup>*</sup></label>
                                <input type="file" name="sub_img" accept="image/*" multiple class="sub_img">
                                <p> 캠페인 상세 페이지에 등록 될 이미지 </p>
                                <p> 최대 개수: 5개 </p>
                            </div>
                            <div class="input_wrap">
                                <label for="date">캠페인 일정<sup>*</sup></label>
                                <div>
                                    <label for="apply_due_date">신청 기간</label>
                                    <input type="date" name="apply_due_date" class="apply_due_date">
                                    <input type="date" name="apply_due_date" class="apply_due_date">
                                </div>
                                <div>                                
                                    <label for="notice_date">발표일</label>
                                    <input type="date" name="notice_date" class="notice_date">
                                </div>
                                <div>                         
                                    <label for="post_date">포스팅 기간</label>       
                                    <input type="date" name="post_date" class="post_date">
                                    <input type="date" name="post_date" class="post_date">
                                </div>
                            </div>
                            <div class="input_wrap">
                                <label for="camp_description">캠페인 설명<sup>*</sup></label>
                                <textarea name="camp_description" cols="40" rows="8" class="camp_description"></textarea>
                            </div>
                            <div class="input_wrap">
                                <label for="mission_description">미션 설명<sup>*</sup></label>
                                <textarea name="mission_description" cols="40" rows="8" class="mission_description"></textarea>
                            </div>
                            <div class="input_wrap">
                                <label for="benefit_description">보상 설명<sup>*</sup></label>
                                <textarea name="benefit_description" cols="40" rows="8" class="benefit_description"></textarea>
                            </div>
                            <div class="input_wrap">
                                <label for="hash_tag">해시 태그<sup>*</sup></label>
                                <input type="text" name="hash_tag" class="hash_tag" placeholder="#패션#음식#화장품">
                            </div>
                        </form>
                        <div>
                            <input type="button" value="등록" name="camp_register_btn" class="camp_register_btn">
                            <input type="button" value="취소" name="camp_cancel_btn" class="camp_cancel_btn">
                        </div>
                    </div>
                </div>
            </div>
        `,
        footer: ``,
        script: `
        <script src="/front/script/advertiser/adv_campaign_registration.js"></script>
        <script>
            go('.camp_register_btn', $, AdvCampaignRegistration.Do.registerCampaign);
            go('.main_img', $, AdvCampaignRegistration.Do.readyImage);

        </script>
        `
    }));
});

app.post('/api/advertiser/adv_campaign_registration', cpUpload, (req, res) => {
    const {camp_name, sns_type, category, apply_due_date, notice_date, post_date, ...info} = req.body;

    const data = {
        name: camp_name,
        sns_type: sns_type,
        category: category,
        state: 'wait', //wait, progress, complete
        info: info,
        created_at: new Date(),
        apply_start_date: apply_due_date[0],
        apply_end_date: apply_due_date[1],
        notice_date: notice_date,
        post_start_date: post_date[0],
        post_end_date: post_date[1],
        advertiser_id: 'test' // req.session.user.id
    };
    const newMainImg = req.files['main_img'];
    const newSubImgs = req.files['sub_img'];
    let fileName = null, campaign_id = null, index=0;

    go(
        data,
        a => QUERY `INSERT INTO campaign ${VALUES(a)} RETURNING id`,
        first,
        b => campaign_id = b.id,
        // 대표 이미지 업로드
        _ => go(
            newMainImg,
            map((file) => {
                fileName = 'campaign_mainImage'; // 대표 이미지 파일명
                awsS3.insertImgToS3(file, awsS3.convertImgPath(campaign_id, 'test', fileName));
                return awsS3.getS3URL() + awsS3.convertImgPath(campaign_id, 'test',fileName);
            }),
            ([c]) => QUERY `UPDATE campaign SET img = ${c} WHERE id = ${campaign_id}`
        ),
        // 상세 다중 이미지 업로드
        _ => go(
            newSubImgs,
            map((file) => {
                fileName = `campaign_subImage_${index+= 1}`; // 상세 이미지 파일명
                awsS3.insertImgToS3(file, awsS3.convertImgPath(campaign_id, 'test',fileName));
                return awsS3.getS3URL() + awsS3.convertImgPath(campaign_id, 'test',fileName);
            }),
            c => QUERY `UPDATE campaign SET sub_img = ${JSON.stringify(c)} WHERE id = ${campaign_id}`
        ),
        _ => setTimeout(() => {res.redirect('/advertiser/adv_campaign_management')}, 500)
    )
});