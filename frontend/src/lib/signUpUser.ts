import { SIGN_UP } from "@/app/graphQl/tanstackMutations/userMutations";

async function SignUpUser(name: string, email: string, password: string) {

    try {
        const response = await fetch(`http://localhost:4000/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: SIGN_UP,
                variables: {
                    name,
                    email,
                    password
                }
            })
        })

        const result = await response.json()
        return result
    } 
    catch (error) {
        console.log("Error in Signing Up", error)
        return error
    }
}

export default SignUpUser