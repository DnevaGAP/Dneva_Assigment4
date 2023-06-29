
const apiBankAccounts = `${Cypress.env("apiUrl")}/bankAccounts`;

describe('Bank Account -API test', function () {
    let AccountID = [];



    beforeEach('log in', () => {
        cy.visit('http://localhost:3000/signin')
        cy.get('#username').clear().type('Katharina_Bernier')
        cy.get('#password').clear().type('s3cret')
        cy.get('.MuiButton-label').click()
        cy.get('H6[data-test="sidenav-user-full-name"]').should('have.text', 'Edgar J')
    });

    //Create Bank Accounts
    it('Create Bank Accounts', () => {
        for (let i = 0; i < 5; i++) {
            cy.request("POST", `${apiBankAccounts}`, {
                bankName: "TestBank" + i,
                accountNumber: "123456789" + i,
                routingNumber: "987654321" + i
            }).then((response) => {
                AccountID.push(response.body.account.id);
                expect(response.status).to.eq(200);
            })
        }
    })


    //Check Bank Accounts
    it('List all accounts', () => {
        AccountID.forEach((value) => {
            cy.request("GET", `${apiBankAccounts}/${value}`, {
            }).then((response) => {
                expect(response.status).to.eq(200);
                console.log(response)
            });
        })
        cy.visit('${apiBankAccounts}');
    })


    //Delete Bank Accounts
    it('Delete all accounts', () => {
        for (let i = 0; i < 5; i++) {
            cy.request("POST", `${apiBankAccounts}`, {
                "bankName": "TestBank" + i,
                "accountNumber": "00123456789" + i,
                "routingNumber": "987654300" + i
            }).then((response) => {
                AccountID.push(response.body.account.id);
                expect(response.status).to.eq(200);
            })
        }
        AccountID.forEach((value) => {
            cy.request("DELETE", `${apiBankAccounts}/${value}`, {
            }).then((response) => {
                expect(response.status).to.eq(200);
                console.log(response)
            });
        })
        cy.visit('${apiBankAccounts}');
    })



})