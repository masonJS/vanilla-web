/**
 * Custom modules
 */

require('../module/share/base/ff');
require('../module/share/base/ttl');
require('../module/share/base/global');
require('../module/share/base/formatter');

Object.assign(global, FF);
Object.assign(global, TTL);
Object.assign(global, Formatter);


require('../module/share/template/tmpl');
require('../module/share/template/tmpl.layout');
require('../module/share/template/influencer/inf_campaign_list');
require('../module/share/template/advertiser/adv_campaign_detail');
require('../module/share/template/advertiser/adv_influencer_list');
require('../module/share/template/advertiser/adv_campaign_modify');
