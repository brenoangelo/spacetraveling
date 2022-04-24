import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import Prismic from '@prismicio/client';

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
  const router = useRouter();

  function calcReadingTime() {
    const words = post.data.content.reduce((acc, valorAtual) => {
      let tamanho = RichText.asText(valorAtual.body)
        .replace(/<[^>]*>/g, '')
        .split(' ');
      acc = acc.concat(tamanho.concat(valorAtual.heading.split(' ')));

      return acc;
    }, []);

    return `${Math.ceil(words.length / 200)} min`;
  }

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <div className={styles.post}>
        <header>
          <img
            src={
              post.data.banner?.url
                ? post.data.banner.url
                : '/images/bannerDefault.jpg'
            }
            alt={post.data.title}
          />
        </header>
        <div className={commonStyles.container}>
          <div className={styles.postHeader}>
            <h1>{post.data.title}</h1>
            <span className={commonStyles.postSingleDetails}>
              <time>
                <FiCalendar size={20} />
                {format(new Date(post.first_publication_date), 'PP', {
                  locale: ptBR,
                })}
              </time>

              <span>
                <FiUser size={20} /> {post.data.author}
              </span>

              <time>
                <FiClock size={20} />
                {calcReadingTime()}
              </time>
            </span>
          </div>

          <main>
            {post.data.content.map((content, index) => (
              <div className={styles.postParagraph} key={index}>
                <h2>{content.heading}</h2>
                <div
                  className={styles.paragraphContent}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
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
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.uid'],
    }
  );

  const postsSlugs = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths: [...postsSlugs],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: response.data.banner ?? '',
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post: post,
    },
  };
};
