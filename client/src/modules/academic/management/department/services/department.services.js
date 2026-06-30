import API from "../../../../../services/api"

export const getDepartment = async () => {

    const response = await API.get("/department")

    return response.data
}

export const createDepartment = async (data) => {

    const response = await API.post("/department",data)

    return response.data
}

export const updateDepartment = async (id, data) => {

    const response = await API.put(`/department/${id}`,data)

    return response.data
}

export const deleteDepartment = async (id) => {

    const response = await API.delete(`/department/${id}`)

    return response.data
}