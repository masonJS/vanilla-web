const authenticate = require('../loaders/authenticate')
/**
 * Common router
 */
require('./common/home');
require('./common/signin');
require('./common/signup_popup');
require('./common/signout');
require('./common/find_user');

require('./advertiser/adv_signup');
require('./advertiser/adv_signup_complete');

require('./influencer/inf_signup');
require('./influencer/inf_signup_complete');
require('./influencer/inf_signup_connect_instagram');

app.use(authenticate)
/**
 * Advertiser router
 */
require('./advertiser/adv_my_info');
require('./advertiser/adv_campaign_registeration');
require('./advertiser/adv_campaign_management');
require('./advertiser/adv_campaign_modify');
require('./advertiser/adv_campaign_detail');
require('./advertiser/adv_influencer_list');

/**
* Influencer router
*/
require('./influencer/inf_my_info');
require('./influencer/inf_campaign_list');
require('./influencer/inf_campaign_detail');
require('./influencer/inf_campaign_apply');
require('./influencer/inf_campaign_management');
/**
* Admin router
*/

