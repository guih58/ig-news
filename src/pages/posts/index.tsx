import { GetStaticProps } from 'next'
import Head from 'next/head'
import { getPrismicClient } from '../../service/prismic'
import styles from './style.module.scss'
import Prismic from '@prismicio/client'
import { RichText} from "prismic-dom"
import Link from 'next/link'

type Post ={
    slug: string;
    title:string;
    excerpt: string;
    updateAt:string
}

interface PostProps {
    posts: Post[]
}

export default function Posts({posts}){
    return(
        <>
            <Head>
                <title>Posts | ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts} >
                {posts.map( post =>(
                    <Link href={`/posts/${post.slug}`}>
                       <a key={post.slug}>
                       <time>{post.updateAt}</time>
                       <strong> {post.title}</strong>
                       <p>{post.excerpt}</p>
                   </a>
                    </Link>
                    
                ))}
                    </div>
            </main>
        </>
    )

    
}

export const getStaticProps: GetStaticProps =  async () =>{
    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type' , 'publication')

    ],{
        fetch: ['publication.title' , 'publication.content'],
        pageSize: 100,
    }
    
    )

      const posts = response.results.map(post =>{
          return{
              slug: post.uid,
              title: RichText.asText(post.data.title),
              excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
              updateAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR',{
                  day:'2-digit',
                  month: 'long',
                  year: 'numeric'

              })

          }
      })
        
    return{
        props:{
            posts
        }
    }
}