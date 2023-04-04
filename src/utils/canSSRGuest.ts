import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies'

// configurar paginas que podem ser acessadas por visitantes

export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cokies = parseCookies(ctx);

        // User que estar acessando e a tem login salvo, sera redirecionado

        if(cokies['@nextauth.token']){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return await fn(ctx)

    }
}