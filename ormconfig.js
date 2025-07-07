module.exports = {
    type: 'postgres',
    host: 'ep-solitary-rice-a7jwgjs5-pooler.ap-southeast-2.aws.neon.tech',
    port: 5432,
    username: 'chat_db_owner',
    password: 'npg_v67aTkAYQRex',
    database: 'chat_db',
    synchronize: true,
    logging: true,
    entities: ['entities/*.js'],
};
