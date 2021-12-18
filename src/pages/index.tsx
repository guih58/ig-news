import Head from 'next/head'
import { Header } from '../components/Header'
import { SubscribeButton } from '../components/SubscribeButton'
import styles from './home.module.scss'
import {GetStaticProps} from 'next'
import { stripe } from '../service/stripe'

interface HomeProps{
  product:{
    priceId: string;
    amount: number;
  }
}

export default function Home({product}:HomeProps) {
  return (
    <>
    <Head>
      <title>ignew | Home</title>
    </Head>

    <main className={styles.contentConatiner}>
        <section className={styles.hero} >
          <span>👏 Hey , welcome</span>
          <h1>News about the <span>React</span> word.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
       </section>

        <img src="./images/avatar.svg" alt="Girl codign" />

    </main>  
   

    </>
  )
}

export const getStaticProps: GetStaticProps= async()=>{
  const price = await stripe.prices.retrieve('price_1K6mINFMJzkhJIAiHni4f6mZ' , {
    expand: ['product']
  })
  const product = {
    preceId: price.id,
    amount: new Intl.NumberFormat('en-US',{
      style:'currency',
      currency: 'USD',
    }).format(price.unit_amount /100),
  };
  return{
    props:{
      product
    },
    revalidate: 60 * 60 * 24 // 24horas,
  }
}