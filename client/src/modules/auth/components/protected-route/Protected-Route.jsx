import {Navigate} from 'react-router-dom'
import useAuthStore from '../../state/auth-store'

const ProtectedRoute = ({children}) => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const user = useAuthStore((state) => state.user)

    if(!accessToken) {
        return <Navigate to="/" replace/>
    }

    if (user?.mustChangePassword) {
        return <Navigate to="/change-password" replace/>
    }

    return children

}

export default ProtectedRoute