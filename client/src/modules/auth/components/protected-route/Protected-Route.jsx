import {Navigate} from 'react-router-dom'
import useAuthStore from '../../state/auth-store'

const ProtectedRoute = ({children}) => {
    const token = useAuthStore((state) => state.token)

    if(!token) {
        return <Navigate to="/" replace/>
    }

    return children

}

export default ProtectedRoute