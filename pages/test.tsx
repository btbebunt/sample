'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface FormData {
  query: string;
}

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data: any) => {
    setLoading(true);
    setResults([]);
    setHasSearched(true);
    try {
      const query = data.query.trim();
      if (!query) return;

      const response = await fetch(`/api/notion?query=${query}`);
      const result = await response.json();

      const filteredResults = result.filter(
        (item: any) => item.properties?.checkbox?.checkbox !== true
      );

      // 상태값별로 우선순위에 따라 항목을 분류
      const mainPriorityResults = filteredResults.filter((item: any) => 
        item.properties?.Status?.status?.name === 'Улаанбаатарт ирсэн'
      );
      const secondPriorityResults = filteredResults.filter((item: any) => 
        item.properties?.Status?.status?.name === 'Эрээн-> Улаанбаатар'
      );
      const thirdPriorityResults = filteredResults.filter((item: any) => 
        item.properties?.Status?.status?.name === 'Эрээнд ирсэн'
      );
      const otherResults = filteredResults.filter((item: any) => 
        !['Улаанбаатарт ирсэн', 'Эрээн-> Улаанбаатар', 'Эрээнд ирсэн'].includes(item.properties?.Status?.status?.name)
      );

      // 우선순위대로 결과 배치
      setResults([
        ...mainPriorityResults, 
        ...secondPriorityResults, 
        ...thirdPriorityResults, 
        ...otherResults
      ]);
    } catch (error) {
      console.error('Error searching Notion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url('https://cdn.caliverse.io/images/bg_mint.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 검색창과 결과 영역 */}
      <div className="flex flex-grow justify-center items-center">
        <div className="max-w-md w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Uni Cargo
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="query"
                  type="text"
                  {...register('query', { required: '*Заавал утга оруулна уу.' })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Утасны дугаар эсвэл захиалгын дугаараа оруулна уу."
                />
                {errors.query && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.query.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading
                    ? 'bg-indigo-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? 'Хайж байна...' : 'Хайх'}
              </button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-700">Үр дүн</h3>
              <div className="max-h-96 overflow-y-auto mt-4">
                <ul className="space-y-4">
                  {results.map((result) => (
                    <li key={result.id} className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Утасны дугаар:{' '}
                        <span className="text-blue-500 font-semibold">
                          {result.properties?.Phone?.phone_number || '정보 없음'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Захиалгын дугаар:{' '}
                        <span className="text-blue-500 font-semibold">
                          {result.properties?.Order?.rich_text[0]?.text?.content || '정보 없음'}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Төлөв:{' '}
                        <span className="text-blue-500 font-semibold">
                          {result.properties?.Status?.status?.name || '정보 없음'}
                        </span>
                      </p>
                      <p className="text-sm font-bold text-gray-600">
                        Үнийн дүн:{' '}
                        {result.properties?.Price?.number || '정보 없음'}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-gray-600 text-sm">Нийт {results.length} ачаа</p>
            </div>
          )}

          {!loading && hasSearched && results.length === 0 && (
            <div className="mt-8 text-center text-gray-500">
              Илэрц олдсонгүй.
            </div>
          )}
        </div>
      </div>

     
    </div>
  );
}
