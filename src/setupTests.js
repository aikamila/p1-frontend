import '@testing-library/jest-dom';
import { server } from './mocks/server.js'
import * as JWTDecoding from './utils/JWTDecode'


beforeAll(() => {
    server.listen()
    Object.defineProperty(HTMLMediaElement.prototype, "muted", {
        set: jest.fn(),
    });
})

afterEach(() => {
    server.resetHandlers()
})

afterAll(() => {
    server.close()
})

const JWTIdDecoder = jest.spyOn(JWTDecoding, 'decodeUser')
JWTIdDecoder.mockImplementation(() => {return 1})

