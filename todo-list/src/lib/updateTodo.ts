import { UPDATE_TODO } from "@/app/graphQl/tanstackMutations/todoMutations";

async function UpdateTodo(id: string, todo: string, description: string, isPending: boolean) {
    try {
        const response = await fetch(`http://localhost:4000/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: UPDATE_TODO,
                variables: {
                    id,
                    todo,
                    description,
                    isPending 
                }
            })
        })

        const result = await response.json()
        return result.data
    } 
    catch (error) {
        console.log("Error in Updating Todo", error)
    }
}

export default UpdateTodo