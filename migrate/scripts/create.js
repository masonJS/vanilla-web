!function () {
    const CREATE = {};
    CREATE.TABLE = {};
    CREATE.INDEX = {};

    /**
     * User table
     * Latest update - January 22, 2019
     */
    CREATE.TABLE.users = _ => QUERY `
        CREATE TABLE users (
            id varchar(30),
            pw varchar(30) NOT NULL,
            info json NOT NULL,
            auth varchar(20) NOT NULL,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp,
            deleted_at timestamp,
            sns_info json,
            PRIMARY KEY(id)
        );  
    `;
    // CREATE UNIQUE INDEX user_pkey ON users(id text_ops);

    /**
     * Campaign table
     * Latest update - January 22, 2019
     */
    CREATE.TABLE.campain = _ => QUERY `
        CREATE TABLE campaign (
            id SERIAL PRIMARY KEY,
            name varchar(100) NOT NULL,
            sns_type varchar(20) NOT NULL,
            category varchar(20) NOT NULL,
            state varchar(20) NOT NULL,
            img text(100),
            info json,
            created_at timestamp NOT NULL,
            updated_at timestamp,
            apply_start_date timestamp NOT NULL,
            notice_date timestamp NOT NULL,
            post_start_date timestamp NOT NULL,
            advertiser_id varchar(30) NOT NULL,
            apply_end_date timestamp NOT NULL,
            post_end_date timestamp NOT NULL,
            sub_img json,
            influencer_id json
        );
    `;

    module.exports = {
        CREATE
    }
} ();

