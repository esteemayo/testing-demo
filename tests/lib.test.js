const { absolute, greet, getCurrencies, getProduct, registerUser, applyDiscount, notifyCustomer } = require('../lib');
const db = require('../db');
const mail = require('../mail');

describe('absolute', () => {
    it('should return a positive number if input is positive', () => {
        const result = absolute(1)
        expect(result).toBe(1)
    })
    
    it('should return a negative number if input is negative', () => {
        const result = absolute(-1)
        expect(result).toBe(1)
    })
    
    it('should return 0 if input is 0', () => {
        const result = absolute(0)
        expect(result).toBe(0)
    })
})

describe('greet', () => {
    it('should return the greeting message', () => {
      const result = greet('John')
      expect(result).toMatch(/John/)
      expect(result).toContain('John')
    })
})

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const result = getCurrencies()

        // Too general
        expect(result).toBeDefined()
        expect(result).not.toBeNull()

        // Too specific
        expect(result[0]).toBe('USD')
        expect(result[1]).toBe('AUD')
        expect(result[2]).toBe('EUR')

        // Proper way
        expect(result).toContain('USD')
        expect(result).toContain('AUD')
        expect(result).toContain('EUR')

        // Idea way
        expect(result).toEqual(expect.arrayContaining(['USD', 'AUD', 'EUR']))
    })
})

describe('getProduct', () => {
    it('should return product with the given id', () => {
        const result = getProduct(1)
        // expect(result).toEqual({ id: 1, price: 10 })
        expect(result).toMatchObject({ id: 1, price: 10 })
        expect(result).toHaveProperty('id', 1)
    })
})

describe('registerUser', () => {
    it('should throw if username is falsy', () => {
        const args = [null, undefined, NaN, '', 0, false]
        args.forEach(a => {
            expect(() => registerUser(a)).toThrow()
        })
    })

    it('should return a user object if valid username is passed', () => {
        const result = registerUser('john')
        expect(result).toMatchObject({ username: 'john' })
        expect(result.id).toBeGreaterThan(0)
    })
})

describe('applyDiscount', () => {
    it('should apply 10% discount if customer has more than 10 points', () => {
        db.getCustomerSync = function(customerId) {
            console.log('Fake reading customer...');
            return { id: customerId, points: 20 }
        }
        
        const order = { customerId: 1, totalPrice: 10 }
        applyDiscount(order)
        expect(order.totalPrice).toBe(9)
    })
})

describe('notifyCustomer', () => {
    it('should send an email to the customer', () => {
        db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a' })
        mail.send = jest.fn()
    
        notifyCustomer({ customerId: 1 })

        expect(mail.send).toHaveBeenCalled()
        expect(mail.send.mock.calls[0][0]).toBe('a')
        expect(mail.send.mock.calls[0][1]).toMatch(/order/)
    })
})