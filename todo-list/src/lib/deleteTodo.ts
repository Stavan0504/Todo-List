import { DELETE_TODO } from "@/app/graphQl/tanstackMutations/todoMutations";

async function DeleteTodo(id: string) {
    try {
        const response = await fetch(`http://localhost:4000/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: DELETE_TODO,
                variables: {
                    id 
                }
            })
        })

        const result = await response.json()
        return result.data
    } 
    catch (error) {
        console.log("Error in Deleting todo", error)
    }
}

export default DeleteTodo