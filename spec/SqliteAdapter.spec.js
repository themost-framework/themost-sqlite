const {SqliteAdapter, createInstance} = require('../index');
const fs = require('fs');
const path = require('path');
const { QueryExpression }  = require('@themost/query')
const ProductModel = require('./config/models/Product.json');
const EmployeeModel = require('./config/models/Employee.json');
const CategoryModel = require('./config/models/Category.json');
// get options from environmet for testing
const testConnectionOptions = {
    'database': 'spec/test.db'
};

describe('SqliteAdapter', () => {

    beforeAll( async () => {
        const db = path.resolve(process.cwd(), testConnectionOptions.database);
        if (fs.existsSync(db) === true) {
            fs.unlinkSync(db);
        }
    });
    afterAll( async () => {
        //
    });

    it('should create instance', async () => {
        const adapter = new SqliteAdapter();
        expect(adapter).toBeTruthy();
    });

    it('should use createInstance()', async () => {
        const adapter = createInstance();
        expect(adapter).toBeTruthy();
        expect(adapter).toBeInstanceOf(SqliteAdapter);
    });

    it('should use open()', async () => {
        /**
         * @type {MSSqlAdapter}
         */
        const adapter = createInstance(testConnectionOptions);
        await adapter.openAsync();
        expect(adapter.rawConnection).toBeTruthy();
        await adapter.closeAsync();
        expect(adapter.rawConnection).toBeFalsy();
    });

    it('should use close()', async () => {
        /**
         * @type {MSSqlAdapter}
         */
        const adapter = createInstance(testConnectionOptions);
        await adapter.openAsync();
        await adapter.closeAsync();
        expect(adapter.rawConnection).toBeFalsy();
    });

    it('should use migrate()', async () => {
        /**
         * @type {MSSqlAdapter}
         */
        const adapter = createInstance(testConnectionOptions);
        await adapter.migrateAsync({
            add: CategoryModel.fields,
            appliesTo: CategoryModel.source,
            version: CategoryModel.version
        });
        let exists = await adapter.table(CategoryModel.source).existsAsync();
        expect(exists).toBeTrue();
    });
    
    it('should use table(string).exists()', async () => {
        const adapter = new SqliteAdapter(testConnectionOptions);
        let exists = await adapter.table(ProductModel.source).existsAsync();
        if (exists === false) {
            await adapter.table(ProductModel.source).createAsync(ProductModel.fields);
        }
        exists = await adapter.table(ProductModel.source).existsAsync();
        expect(exists).toBeTrue();
        // drop table by executing SQL
        await adapter.executeAsync(`DROP TABLE "${ProductModel.source}";`);
        exists = await adapter.table(ProductModel.source).existsAsync();
        expect(exists).toBeFalse();
        await adapter.closeAsync();
    });

    it('should use table(string).create()', async () => {
        const adapter = new SqliteAdapter(testConnectionOptions);
        let exists = await adapter.table(ProductModel.source).existsAsync();
        if (exists === true) {
            // drop table
            await adapter.executeAsync(`DROP TABLE "${ProductModel.source}";`);
        }
        await adapter.table(ProductModel.source).createAsync(ProductModel.fields);
        exists = await adapter.table(ProductModel.source).existsAsync();
        expect(exists).toBeTrue();
        // drop table
        await adapter.executeAsync(`DROP TABLE "${ProductModel.source}";`);
        await adapter.closeAsync();
    });

    it('should use execute() for insert', async () => {
        const adapter = new SqliteAdapter(testConnectionOptions);
        let exists = await adapter.table(EmployeeModel.source).existsAsync();
        if (exists === false) {
            await adapter.table(EmployeeModel.source).createAsync(EmployeeModel.fields);
        }
        const sources = EmployeeModel.seed.map( item => {
            return new QueryExpression().insert(item).into(EmployeeModel.source);
        }).map( query => {
            return adapter.executeAsync(query);
        });
        await Promise.all(sources);
        const query = new QueryExpression().from(EmployeeModel.source)
            .where('LastName').equal('Davolio')
            .select('EmployeeID', 'LastName', 'FirstName');
        let res = await adapter.executeAsync(query);
        expect(res).toBeInstanceOf(Array);
        expect(res.length).toBe(1);
        expect(res[0].LastName).toBe('Davolio')
        // drop table
        await adapter.executeAsync(`DROP TABLE "${EmployeeModel.source}";`);
        await adapter.closeAsync();
    });

    it('should use execute() for update', async () => {
        const adapter = new SqliteAdapter(testConnectionOptions);
        let exists = await adapter.table(EmployeeModel.source).existsAsync();
        if (exists === false) {
            await adapter.table(EmployeeModel.source).createAsync(EmployeeModel.fields);
        }
        const sources = EmployeeModel.seed.map( item => {
            return new QueryExpression().insert(item).into(EmployeeModel.source);
        }).map( query => {
            return adapter.executeAsync(query);
        });
        await Promise.all(sources);
        const updateQuery = new QueryExpression().update(EmployeeModel.source)
            .set({
                LastName: 'Davolio-Arnold'
            })
            .where('LastName').equal('Davolio');
        await adapter.executeAsync(updateQuery);
        const query = new QueryExpression().from(EmployeeModel.source)
        .where('LastName').equal('Davolio-Arnold')
        .select('EmployeeID', 'LastName', 'FirstName');
        let res = await adapter.executeAsync(query);
        expect(res).toBeInstanceOf(Array);
        expect(res.length).toBe(1);
        expect(res[0].LastName).toBe('Davolio-Arnold');
        // drop table
        await adapter.executeAsync(`DROP TABLE "${EmployeeModel.source}";`);
        await adapter.closeAsync();
    });


    it('should use view(string).exists()', async () => {
        const adapter = new SqliteAdapter(testConnectionOptions);
        let exists = await adapter.view('EmployeesView').existsAsync();
        expect(exists).toBeFalse();

        await adapter.table(EmployeeModel.source).createAsync(EmployeeModel.fields);
        
        await adapter.view('EmployeesView').createAsync(new QueryExpression().from('Employees')
        .select('EmployeeID', 'LastName', 'FirstName', 'BirthDate', 'Photo', 'Notes'));

        exists = await adapter.view('EmployeesView').existsAsync();
        expect(exists).toBeTrue();
        // drop view
        await adapter.view('EmployeesView').dropAsync();
        // drop table
        await adapter.executeAsync(`DROP TABLE "${EmployeeModel.source}";`);
        await adapter.closeAsync();
    });

});