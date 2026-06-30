import { Navigate } from "react-router-dom";

import useAuthStore from "../../modules/auth/state/auth-store";

const RoleProtectedRoute = ({
    children,
    allowedRoles,
}) => {
    const user = useAuthStore(state => state.user)

    if(!user){

        return(
            <Navigate to='/login'/>
        )
    }

    if(!allowedRoles.includes(user.role))
    {
        return(
            <Navigate to='/dashboard' />
        )
    }

    return children

}

export default RoleProtectedRoute