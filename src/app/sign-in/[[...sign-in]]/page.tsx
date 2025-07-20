import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return <section className='flex items-center justify-center mt-20 mb-10'>
        <SignIn />
    </section>
}
