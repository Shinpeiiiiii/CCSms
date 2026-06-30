import axios from 'axios'

const API = 'http://localhost:5000/api/students'

export const getStudents = async () => {
    const response = await axios.get(API)

    return response.data
}


export const createStudent = async (studentData) => {
    console.log("Service received:",studentData)

    const response = await axios.post(API,studentData)

    console.log("axios Response:",response.data)

    console.log("axios data",response.data)
    return response.data
}


export const deleteStudent =
  async (id) => {
    const response =
      await axios.delete(
        `${API}/${id}`
      )

    return response.data
  }

export const updateStudent =
  async (id, data) => {
    const response =
      await axios.put(
        `${API}/${id}`,
        data
      )

    return response.data
  }