import { GET_TODO } from "@/app/graphQl/tanstackQueries/todoQueries";

async function GetTodo(id: string) {
    try {
        const response = await fetch(`http://localhost:4000/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GET_TODO,
                variables: {
                    id
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

export default GetTodo