!function () {
    const id_reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|io|)|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    const Do = {
        signup: $.on('click', '.submit_btn', ({ delegateTarget: dt }) => go(
            {
                id: go(dt, $.find('[name="id"]'), $.trim),
                pw: go(dt, $.find('[name="password"]'), $.trim),
                company_name: go(dt, $.find('[name="company_name"]'), $.trim),
                brand_name: go(dt, $.find('[name="brand_name"]'), $.trim),
                ceo_name: go(dt, $.find('[name="ceo_name"]'), $.trim),
                business_num: go(dt, $.find('[name="business_num"]'), $.trim),
                event: go(dt, $.find('[name="event"]'), $.trim),
                industry: go(dt, $.find('[name="industry"]'), $.trim),
                phone_num: go(dt, $.find('[name="phone_num"]'), $.trim),
                post_code: go(dt, $.find('[name="post_code"]'), $.trim),
                address: go(dt, $.find('[name="address"]'), $.trim),
            },
            pipeT(
                a => {
                    for (key in a) {
                        if (a[key] === '') {
                            throw 'No content'
                        }
                    }
                    for (checkbox of $.all('.chk')) {
                        if (checkbox.checked === false) {
                            throw 'No check';
                        }
                    }
                    return a;
                },
                ({ id, pw, auth, created_at, ...info }) => {
                    return {
                        id: id,
                        pw: pw,
                        info: JSON.stringify(info),
                        auth: 'advertiser',
                        created_at: currentDate('YYYY-MM-DD HH:mm:ss'),
                    }
                },
                $.post('/api/advertiser/adv_signup'),
                a => location.replace(`/advertiser/adv_signup_complete/?name=${a}`)
            ).catch(
                a => match(a)
                    .case(a => a === 'No content')
                    (_ => alert('입력란을 채워주세요.'))
                    .case(a => a === 'No check')
                    (_ => alert('약관 동의에 대해 채크해주세요.'))
                    .else(_ => a),

                b => b.text(),
                match
                    .case('id')
                    (_ => { $('.id_error').innerHTML = '아이디가 중복되었습니다.'; })
                    .else(_ => alert('서버 에러입니다.'))
            )
        )),

        checkId: $.on('click', '.id_chk_btn', ({ delegateTarget: dt }) => go(
            {
                id: go(dt, $.find('.id'), $.trim)
            },
            pipeT(
                a => {
                    if (a.id === '') {
                        throw 'No content';
                    } else if (!id_reg.test(a.id)) {
                        throw 'No email validation';
                    }
                    return a;
                },
                $.post('/api/advertiser/adv_check_id'),
                _ => { $('.id_error').innerHTML = '사용 가능한 아이디입니다.'; }
            ).catch(
                a => match(a)
                    .case(a => a === 'No content')
                    (_ => {
                        $('.id_error').innerHTML = '아이디를 입력해주세요';
                        $('.submit_btn').disabled = 'disabled';
                    })
                    .case(a => a === 'No email validation')
                    (_ => {
                        $('.id_error').innerHTML = '이메일 형식을 맞춰주세요.';
                        $('.submit_btn').disabled = 'disabled';
                    })
                    .else(_ => a),
                b => b.text(),
                match
                    .case('The ID is already exist')
                    (_ => {
                        $('.id_error').innerHTML = '사용할 수 없는 아이디입니다.';
                        $('.submit_btn').disabled = 'disabled';
                    })
                    .else(_ => alert('서버 에러입니다.'))
            )
        )),

        validateEmail: $.on('change', _ => {
            const id = go($('#id'), $.trim);

            if (!id_reg.test(id)) {
                $('.id_error').innerHTML = '이메일 형식을 맞춰주세요.';
                $('.submit_btn').disabled = 'disabled';
            } else {
                $('.id_error').innerHTML = '';
                $('.submit_btn').disabled = false;
            }
        }),

        validatePw: $.on('keyup', _ => {
            const pw = go($('#password'), $.trim);
            const pw_reg = /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

            if (!pw_reg.test(pw)) {
                $('.password_error').innerHTML = '비밀번호 형식을 맞춰주세요';
                $('.submit_btn').disabled = 'disabled';
            } else {
                $('.password_error').innerHTML = '';
                $('.submit_btn').disabled = 'disabled';
            }
        }),

        validateCheckPw: $.on('keyup', _ => {
            const pw = go($('#password'), $.trim);
            const check_pw = go($('#password_chk'), $.trim);
            if (pw === '') {
                $('#password_chk').value = '';
                $('.password_chk_error').innerHTML = '비밀번호를 먼저 입력해주세요.';
                $('.submit_btn').disabled = 'disabled';

            } else if (pw === check_pw) {
                $('.password_chk_error').innerHTML = '';
                $('.submit_btn').disabled = false;

            } else {
                $('.password_chk_error').innerHTML = '비밀번호가 일치하지 않습니다.';
                $('.submit_btn').disabled = 'disabled';
            }
        }),

        showPost: $.on('click', _ => {
            new daum.Postcode({
                oncomplete: function (data) {
                    let fullAddr, extraAddr = '';

                    if (data.userSelectedType === 'R') {
                        fullAddr = data.roadAddress;
                    } else {
                        fullAddr = data.jibunAddress;
                    }

                    if (data.userSelectedType === 'R') {
                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                            extraAddr += data.bname;
                        }
                        if (data.buildingName !== '' && data.apartment === 'Y') {
                            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                        }
                        fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
                    }
                    $('.post_code').value = data.zonecode;
                    $('.address').value = fullAddr;
                    $('.address').focus();
                }
            }).open();
        }),

        checkAllAgree: $.on('click', ({currentTarget: ct}) => go($.all('[type="checkbox"]'), map(a => a.checked = ct.checked)))
    };

global.AdvSignUp = {
        Do
    }
}();
