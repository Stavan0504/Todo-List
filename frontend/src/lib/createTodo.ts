import { CREATE_TODO } from "@/app/graphQl/tanstackMutations/todoMutations";

async function CreateTodo(todo: string, description: string, authorId: string) {
    try {
        const response = await fetch(`http://localhost:4000/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: CREATE_TODO,
                variables: {
                    todo,
                    description,
                    authorId 
                }
            })
        })

        const result = await response.json()
        return result.data
    } 
    catch (error) {
        console.log("Error in Creating todo", error)
    }
}

export default CreateTodo