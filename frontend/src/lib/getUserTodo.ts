import { GET_USER_TODOS } from "@/app/graphQl/tanstackQueries/todoQueries";

async function GetUserTodo(userId: string) {
    try {
        const response = await fetch(`http://localhost:4000/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GET_USER_TODOS,
                variables: {
                    userId
                }
            })
        })

        const result = await response.json()
        return result.data
    } 
    catch (error) {
        console.log("Error in Getting UserTodo Data", error)
    }
}

export default GetUserTodo