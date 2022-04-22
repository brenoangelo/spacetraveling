import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import Prismic from '@prismicio/client';
import PrismicDOM from 'prismic-dom'

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import ptBR from 'date-fns/locale/pt-BR';
import { format } from 'date-fns';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const wordsLength = post.data.content.reduce((acc, valorAtual) => {
    let tamanho = PrismicDOM.RichText.asText(valorAtual.body).replace(/<[^>]*>/g, '').split(' ')
    acc = tamanho.concat(valorAtual.heading.split(' ')).length

    return acc
  },0)

  const readingTime = Math.ceil(wordsLength / 200)

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <div className={styles.post}>
        <header>
          <img
            src={
              post.data.banner.url
                ? post.data.banner.url
                : '/images/bannerDefault.jpg'
            }
            alt={post.data.title}
          />
        </header>
        <div className={styles.container}>
          <div className={styles.postHeader}>
            <h1>{post.data.title}</h1>
            <span className={styles.postSingleDetails}>
              <time>
                <FiCalendar size={20} />
                {post.first_publication_date}
              </time>

              <span>
                <FiUser size={20} /> {post.data.author}
              </span>

              <time>
                <FiClock size={20} />{readingTime} min
              </time>
            </span>
          </div>

          <main className={styles.postContent}>
            {post.data.content.map((content, index) => (
              <div className={styles.postParagraph} key={index}>
                <h2>{content.heading}</h2>
                {content.body.map(body => (
                  <div
                    className={styles.paragraphContent}
                    dangerouslySetInnerHTML={{ __html: body.text }}
                  />
                ))}
              </div>
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    fetch: ['post.uid']
  });

  const postsSlugs = posts.results.map(post => ({
    params: {slug: post.uid}
  }))

  return {
    paths: [...postsSlugs],
    fallback: 'blocking'
  }
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'PP',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.main.url ?? '',
      },
      author: response.data.author,
      content: response.data.content.map(contentItem => ({
        heading: contentItem.heading,
        body: contentItem.body.map(bodyItem => ({
            text: RichText.asHtml([bodyItem])
          }))
        
      })),
    },
  };

  return {
    props: {
      post: post,
    },
  };
};
