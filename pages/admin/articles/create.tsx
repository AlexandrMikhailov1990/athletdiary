import React, { useState } from 'react';
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

export default function CreateArticle() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Фитнес', // Значение по умолчанию
    image: '',
    tags: '',
    readTime: '5 минут',
    published: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ArticleFormData, string>>>({});

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
      // В реальном приложении здесь будет API-запрос для создания статьи
      console.log('Отправка данных:', formData);
      
      // Имитация задержки сохранения
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перенаправление на страницу списка статей после успешного создания
      router.push('/admin/articles');
    } catch (error) {
      console.error('Ошибка при сохранении статьи:', error);
      alert('Произошла ошибка при сохранении статьи. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gray-100">
        <Head>
          <title>Создание новой статьи | AthleteDiary</title>
          <meta name="description" content="Страница создания новой статьи в административной панели" />
        </Head>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Создание новой статьи</h1>
            <Link href="/admin/articles" 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
              Назад к списку
            </Link>
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
                  {/* В реальном приложении здесь будет загрузчик изображений */}
                  <div className="mt-2 p-4 border border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-sm text-gray-500">
                      Функция загрузки изображений будет добавлена в следующей версии
                    </p>
                  </div>
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
                      Опубликовать статью сразу
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Кнопки управления */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
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
                {isSaving ? 'Сохранение...' : 'Сохранить статью'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </AuthGuard>
  );
} 