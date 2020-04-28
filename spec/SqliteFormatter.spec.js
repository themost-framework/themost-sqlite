const {SqliteFormatter} = require('../index');

describe('SqliteFormatter', () => {

    it('should create instance', async () => {
        const formatter = new SqliteFormatter();
        expect(formatter).toBeTruthy();
    });

});