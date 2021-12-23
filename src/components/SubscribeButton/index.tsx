
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router';
import { api } from '../../service/api';
import { getStripeJs } from '../../service/stripe-js';
import styles from './styles.module.scss'


interface SubscribeButtonProps {
    priceId: string;
} 
export function SubscribeButton({priceId}:SubscribeButtonProps){
    const router = useRouter()
    const [session] = useSession();

   async function handleSubscribe(){
        if(!session){
            signIn('github')
            return
        }

        if(session.activeSubscription){
            router.push('/posts')
            
            return 
        }

        try{
            const respose = await api.post('/subscribe')
            const { sessionId } = respose.data

            const stripe = await getStripeJs()
            await stripe.redirectToCheckout({sessionId})
        } catch(err){
            alert(err.message)
        }

    }
    return(
        <button
        type="button"
        className={styles.subscribeButton}
        onClick={handleSubscribe}
        >
            subscribe now
        </button>
    )
}