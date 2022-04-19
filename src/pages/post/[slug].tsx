import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import Prismic from '@prismicio/client';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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
                <FiClock size={20} />4 min
              </time>
            </span>
          </div>

          <main className={styles.postContent}>
            {post.data.content.map(content => (
              <div className={styles.postParagraph}>
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
  // const prismic = getPrismicClient();
  // const posts = await prismic.query([
  //   Prismic.predicates.at('document.type', 'post')
  // ], {
  //   fetch: ['post.uid']
  // });

  // return {
  //   paths: [{ params: { uid: String(posts.results) } }],
  //   fallback: 'blocking'
  // }
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.main.url ?? '',
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: content.body
          ? content.body.map(body => ({ text: RichText.asHtml(content.body) }))
          : [],
      })),
    },
  };

  console.log(JSON.stringify(response, null, 2))
  console.log(JSON.stringify(post, null, 2));

  return {
    props: {
      post: post,
    },
  };
};
