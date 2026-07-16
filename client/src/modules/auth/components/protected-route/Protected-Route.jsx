import {Navigate} from 'react-router-dom'
import useAuthStore from '../../state/auth-store'

const ProtectedRoute = ({children}) => {
    const accessToken = useAuthStore((state) => state.accessToken)

    if(!accessToken) {
        return <Navigate to="/" replace/>
    }

    return children

}

export default ProtectedRoute