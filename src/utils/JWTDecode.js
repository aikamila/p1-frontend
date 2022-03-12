import jwt_decode from 'jwt-decode'

export const decodeUser = (data) => {
    return jwt_decode(data.access).user_id
}

