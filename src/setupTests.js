// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import * as React from 'react'
import { server } from './mocks/server.js'
import * as JWTDecoding from './utils/JWTDecode'


beforeAll(() => {
    server.listen()
})

afterEach(() => {
    server.resetHandlers()
})

afterAll(() => {
    server.close()
})

const JWTIdDecoder = jest.spyOn(JWTDecoding, 'decodeUser')
JWTIdDecoder.mockImplementation(() => {return 1})

