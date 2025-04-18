import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthGuard from '@/components/AuthGuard';

// Интерфейс для статьи в форме создания/редактирования
interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  tags: string;
  readTime: string;
  published: boolean;
}

// Доступные категории статей
const CATEGORIES = [
  'Для начинающих',
  'Фитнес',
  'Питание',
  'Тренировки',
  'Восстановление',
  'Мотивация'
];

// Демо-статьи для имитации получения данных
const SAMPLE_ARTICLES = [
  {
    id: '1',
    slug: 'gym-beginners-guide',
    title: 'Как начать заниматься в тренажерном зале: 7 шагов для новичков',
    excerpt: 'Подробное руководство по началу тренировок в тренажерном зале для начинающих',
    image: '/images/articles/gym-beginner.jpg',
    category: 'Для начинающих',
    date: '20 июня 2023',
    readTime: '8 минут',
    tags: 'начинающим,тренажерный зал,фитнес',
    content: '<h2>Введение</h2><p>Начать заниматься в тренажерном зале может быть страшно, особенно если вы никогда раньше не занимались фитнесом. В этой статье мы расскажем о 7 шагах, которые помогут вам начать тренировки уверенно и эффективно.</p>',
    published: true
  },
  {
    id: '2',
    slug: 'best-exercises-for-weight-loss',
    title: 'Лучшие упражнения для похудения: научный подход',
    excerpt: 'Научно обоснованные упражнения для эффективного сжигания жира и похудения',
    image: '/images/articles/weight-loss-exercises.jpg',
    category: 'Фитнес',
    date: '15 июня 2023',
    readTime: '10 минут',
    tags: 'похудение,жиросжигание,кардио,HIIT',
    content: '<h2>Введение</h2><p>Если вашей целью является похудение, важно выбрать правильные упражнения, которые будут наиболее эффективны для сжигания жира. В этой статье мы рассмотрим научно обоснованные подходы к тренировкам для похудения.</p>',
    published: true
  }
];

export default function EditArticle() {
  const router = useRouter();
  const { slug } = router.query;
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Фитнес',
    image: '',
    tags: '',
    readTime: '',
    published: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ArticleFormData, string>>>({});
  const [originalSlug, setOriginalSlug] = useState<string>('');

  // Загрузка данных статьи
  useEffect(() => {
    if (slug) {
      const fetchArticle = async () => {
        setIsLoading(true);
        try {
          // В реальном приложении здесь будет API-запрос для получения статьи
          // Симулируем получение данных
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const article = SAMPLE_ARTICLES.find(a => a.slug === slug);
          
          if (article) {
            setFormData({
              title: article.title,
              slug: article.slug,
              excerpt: article.excerpt,
              content: article.content,
              category: article.category,
              image: article.image,
              tags: article.tags,
              readTime: article.readTime,
              published: article.published
            });
            setOriginalSlug(article.slug);
          } else {
            // Если статья не найдена, перенаправляем на список
            router.push('/admin/articles');
          }
        } catch (error) {
          console.error('Ошибка при загрузке статьи:', error);
          alert('Не удалось загрузить статью. Пожалуйста, попробуйте еще раз.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchArticle();
    }
  }, [slug, router]);

  // Обработка изменений в полях формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку для поля, которое изменили
    if (errors[name as keyof ArticleFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Обработка изменения чекбокса публикации
  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, published: e.target.checked }));
  };

  // Генерация slug из заголовка
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Удаляем специальные символы
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      .replace(/--+/g, '-') // Заменяем множественные дефисы на одиночные
      .trim(); // Убираем пробелы по краям
    
    setFormData(prev => ({ ...prev, slug }));
  };

  // Валидация формы перед отправкой
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ArticleFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Заголовок обязателен';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'URL обязателен';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'URL может содержать только строчные буквы, цифры и дефисы';
    }
    
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Краткое описание обязательно';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Содержание статьи обязательно';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Изображение обязательно';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // В реальном приложении здесь будет API-запрос для обновления статьи
      console.log('Отправка данных:', formData);
      
      // Имитация задержки сохранения
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перенаправление на страницу списка статей после успешного обновления
      router.push('/admin/articles');
    } catch (error) {
      console.error('Ошибка при сохранении статьи:', error);
      alert('Произошла ошибка при сохранении статьи. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AuthGuard adminOnly>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Загрузка статьи...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Редактирование статьи | AthleteDiary</title>
          <meta name="description" content="Страница редактирования статьи в административной панели" />
        </Head>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Редактирование статьи</h1>
            <div className="flex space-x-4">
              <Link href={`/articles/${formData.slug}`} 
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                target="_blank">
                Просмотр
              </Link>
              <Link href="/admin/articles" 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Назад к списку
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Заголовок */}
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Заголовок*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Введите заголовок статьи"
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                {/* URL (slug) */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL*
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-l-md ${errors.slug ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="url-статьи"
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                    >
                      Сгенерировать
                    </button>
                  </div>
                  {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    URL статьи для адресной строки, например: /articles/<span className="font-mono">{formData.slug || 'url-статьи'}</span>
                  </p>
                </div>

                {/* Время чтения */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Время чтения
                  </label>
                  <input
                    type="text"
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5 минут"
                  />
                </div>

                {/* Категория */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Категория*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Теги */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Теги
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="фитнес, питание, тренировки"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Разделяйте теги запятыми
                  </p>
                </div>

                {/* Краткое описание */}
                <div className="col-span-2">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                    Краткое описание*
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={2}
                    className={`w-full p-2 border rounded-md ${errors.excerpt ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Краткое описание статьи для списка и мета-тегов"
                  />
                  {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt}</p>}
                </div>

                {/* Изображение */}
                <div className="col-span-2">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Изображение*
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-md ${errors.image ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="/images/articles/image.jpg"
                  />
                  {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Укажите путь к изображению в формате /images/articles/имя-файла.jpg
                  </p>
                  {/* Предпросмотр изображения */}
                  {formData.image && (
                    <div className="mt-2 relative h-32 bg-gray-100 rounded">
                      <img 
                        src={formData.image} 
                        alt="Предпросмотр изображения" 
                        className="h-full max-w-full object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>

                {/* Содержание статьи */}
                <div className="col-span-2">
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Содержание статьи*
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={15}
                    className={`w-full p-2 border rounded-md ${errors.content ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Содержание статьи в HTML-формате"
                  />
                  {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Поддерживается HTML-разметка для форматирования текста
                  </p>
                </div>

                {/* Статус публикации */}
                <div className="col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handlePublishedChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                      Опубликовать статью
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки управления */}
            <div className="px-6 py-4 bg-gray-50 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Вы уверены, что хотите удалить эту статью? Это действие невозможно отменить.')) {
                    // В реальном приложении здесь будет API-запрос для удаления статьи
                    console.log('Удаление статьи:', originalSlug);
                    router.push('/admin/articles');
                  }
                }}
                className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Удалить статью
              </button>
              
              <div className="flex space-x-4">
                <Link 
                  href="/admin/articles"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                    isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
} 