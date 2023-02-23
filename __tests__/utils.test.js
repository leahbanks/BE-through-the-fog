const {
	Format_coords
	
} = require("../db/utils");


    describe('function - Format_coords', () => {
        test("takes an array and returns a string", () => {
            const sample = [2, 5]
            const result = Format_coords(sample)
            expect(typeof result).toBe('string')
        })
        test("returns the array in the format for SQL insertion", () => {
            const expected = `{-0.145, 51.505}`
            const testArr = [-0.145, 51.505]
            const result = Format_coords(testArr)
            expect(result).toEqual(expected)
        })
        test("returns the array when not put into shorthand", () => {
            const expected = `{-0.1429489005651874, 51.50080870807764}`
            const testArr = [-0.1429489005651874, 51.50080870807764]
            const result = Format_coords(testArr)
            expect(result).toEqual(expected)
        })
    })