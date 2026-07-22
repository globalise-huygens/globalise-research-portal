import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

export default setupWorker(
  http.post<object, { offset: number, limit: number }>('https://globalise-panoptes/api/datasets/globalise/search', async ({ request }) => searchResolver(await request.json())),
  http.post('https://globalise-panoptes/api/datasets/globalise/facet/archive', archiveResolver),
);

function searchResolver({ offset, limit }: { offset: number; limit: number }) {
  return HttpResponse.json({
    amount: 50, items: [...Array(limit).keys()].map((i) => {
      const id = offset + i + 1;
      return { id, title: `Item ${id}` };
    }),
  });
}

function archiveResolver() {
  return HttpResponse.json([
    {
      'name': 'Deel II',
      'children': [
        {
          'name': 'Deel II/E',
          'children': [
            {
              'name': 'Deel II/E.5',
              'children': [
                {
                  'name': 'Deel II/E.5.04',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [
                        {
                          'name': '7872',
                          'children': [],
                          'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.04|div.nrs.|7872',
                          'count': 2,
                        },
                      ],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.04|div.nrs.',
                      'count': 122,
                    },
                    {
                      'name': '7874, 7897-7902',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.04|7874, 7897-7902',
                      'count': 7,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.04',
                  'count': 130,
                },
                {
                  'name': 'Deel II/E.5.14',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.14|div.nrs.',
                      'count': 94,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.14',
                  'count': 98,
                },
                {
                  'name': 'Deel II/E.5.15',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.15|div.nrs.',
                      'count': 84,
                    },
                    {
                      'name': '8436-8437, 8670-8676',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.15|8436-8437, 8670-8676',
                      'count': 9,
                    },
                    {
                      'name': '8677-8679',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.15|8677-8679',
                      'count': 3,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.15',
                  'count': 97,
                },
                {
                  'name': 'Deel II/E.5.07',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.07|div.nrs.',
                      'count': 83,
                    },
                    {
                      'name': '8151-8155',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.07|8151-8155',
                      'count': 5,
                    },
                    {
                      'name': '8156-8158',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.07|8156-8158',
                      'count': 3,
                    },
                    {
                      'name': '8159-8161',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.07|8159-8161',
                      'count': 2,
                    },
                    {
                      'name': '8161, 8164',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.07|8161, 8164',
                      'count': 1,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.07',
                  'count': 96,
                },
                {
                  'name': 'Deel II/E.5.08',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.08|div.nrs.',
                      'count': 87,
                    },
                    {
                      'name': '8264-8268',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.08|8264-8268',
                      'count': 4,
                    },
                    {
                      'name': '8269-8270',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.08|8269-8270',
                      'count': 2,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.08',
                  'count': 95,
                },
                {
                  'name': 'Deel II/E.5.21',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.21|div.nrs.',
                      'count': 95,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.21',
                  'count': 95,
                },
                {
                  'name': 'Deel II/E.5.20',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.20|div.nrs.',
                      'count': 85,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.20',
                  'count': 85,
                },
                {
                  'name': 'Deel II/E.5.22',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.22|div.nrs.',
                      'count': 85,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.22',
                  'count': 85,
                },
                {
                  'name': 'Deel II/E.5.06',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.06|div.nrs.',
                      'count': 56,
                    },
                    {
                      'name': '8035-8047',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.06|8035-8047',
                      'count': 12,
                    },
                    {
                      'name': '8041, 8049-8056',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.06|8041, 8049-8056',
                      'count': 9,
                    },
                    {
                      'name': '8057-8061',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.06|8057-8061',
                      'count': 5,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.06',
                  'count': 84,
                },
                {
                  'name': 'Deel II/E.5.30',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.30|div.nrs.',
                      'count': 83,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.30',
                  'count': 83,
                },
                {
                  'name': 'Deel II/E.5.23',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [
                        {
                          'name': '9015A-9015C',
                          'children': [],
                          'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.23|div.nrs.|9015A-9015C',
                          'count': 3,
                        },
                        {
                          'name': '9013A-9013B',
                          'children': [],
                          'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.23|div.nrs.|9013A-9013B',
                          'count': 2,
                        },
                        {
                          'name': '9014A-9014B',
                          'children': [],
                          'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.23|div.nrs.|9014A-9014B',
                          'count': 2,
                        },
                      ],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.23|div.nrs.',
                      'count': 74,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.23',
                  'count': 74,
                },
                {
                  'name': 'Deel II/E.5.02',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.02|div.nrs.',
                      'count': 69,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.02',
                  'count': 69,
                },
                {
                  'name': 'Deel II/E.5.12',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.12|div.nrs.',
                      'count': 58,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.12',
                  'count': 59,
                },
                {
                  'name': 'Deel II/E.5.11',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.11|div.nrs.',
                      'count': 52,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.11',
                  'count': 53,
                },
                {
                  'name': 'Deel II/E.5.05',
                  'children': [
                    {
                      'name': '7903-7947, 8522',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.05|7903-7947, 8522',
                      'count': 33,
                    },
                    {
                      'name': '7953-7962',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.05|7953-7962',
                      'count': 10,
                    },
                    {
                      'name': '7948-7952',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.05|7948-7952',
                      'count': 3,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.05',
                  'count': 46,
                },
                {
                  'name': 'Deel II/E.5.03',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.03|div.nrs.',
                      'count': 42,
                    },
                    {
                      'name': '7771-7772',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.03|7771-7772',
                      'count': 2,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.03',
                  'count': 45,
                },
                {
                  'name': 'Deel II/E.5.16',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.16|div.nrs.',
                      'count': 43,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.16',
                  'count': 43,
                },
                {
                  'name': 'Deel II/E.5.24',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.24|div.nrs.',
                      'count': 43,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.24',
                  'count': 43,
                },
                {
                  'name': 'Deel II/E.5.13',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.13|div.nrs.',
                      'count': 37,
                    },
                    {
                      'name': '8484-8487',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.13|8484-8487',
                      'count': 4,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.13',
                  'count': 41,
                },
                {
                  'name': 'Deel II/E.5.29',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.29|div.nrs.',
                      'count': 17,
                    },
                    {
                      'name': '9115-9123',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.29|9115-9123',
                      'count': 9,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.29',
                  'count': 26,
                },
                {
                  'name': 'Deel II/E.5.09',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.09|div.nrs.',
                      'count': 21,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.09',
                  'count': 22,
                },
                {
                  'name': 'Deel II/E.5.19',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.19|div.nrs.',
                      'count': 10,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.19',
                  'count': 12,
                },
                {
                  'name': 'Deel II/E.5.18',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.18|div.nrs.',
                      'count': 11,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.18',
                  'count': 11,
                },
                {
                  'name': 'Deel II/E.5.25',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.25|div.nrs.',
                      'count': 9,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.25',
                  'count': 9,
                },
                {
                  'name': 'Deel II/E.5.26',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.26|div.nrs.',
                      'count': 6,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.26',
                  'count': 6,
                },
                {
                  'name': 'Deel II/E.5.17',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.17|div.nrs.',
                      'count': 4,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.17',
                  'count': 4,
                },
                {
                  'name': 'Deel II/E.5.10',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.10|div.nrs.',
                      'count': 3,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.10',
                  'count': 3,
                },
                {
                  'name': 'Deel II/E.5.28',
                  'children': [
                    {
                      'name': '8723, 9100-9101',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.28|8723, 9100-9101',
                      'count': 3,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.28',
                  'count': 3,
                },
                {
                  'name': 'Deel II/E.5.27',
                  'children': [
                    {
                      'name': '8705, 9098',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.27|8705, 9098',
                      'count': 1,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.27',
                  'count': 2,
                },
                {
                  'name': 'Deel II/E.5.01',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.01|div.nrs.',
                      'count': 1,
                    },
                  ],
                  'value': 'Deel II|Deel II/E|Deel II/E.5|Deel II/E.5.01',
                  'count': 1,
                },
              ],
              'value': 'Deel II|Deel II/E|Deel II/E.5',
              'count': 1520,
            },
            {
              'name': 'Deel II/E.1',
              'children': [
                {
                  'name': '7528-7595',
                  'children': [],
                  'value': 'Deel II|Deel II/E|Deel II/E.1|7528-7595',
                  'count': 68,
                },
              ],
              'value': 'Deel II|Deel II/E|Deel II/E.1',
              'count': 73,
            },
            {
              'name': 'Deel II/E.4',
              'children': [
                {
                  'name': '7618-7647',
                  'children': [],
                  'value': 'Deel II|Deel II/E|Deel II/E.4|7618-7647',
                  'count': 30,
                },
                {
                  'name': '7648-7655, ---',
                  'children': [],
                  'value': 'Deel II|Deel II/E|Deel II/E.4|7648-7655, ---',
                  'count': 8,
                },
              ],
              'value': 'Deel II|Deel II/E|Deel II/E.4',
              'count': 40,
            },
            {
              'name': 'Deel II/E.6',
              'children': [
                {
                  'name': '9180-9189',
                  'children': [],
                  'value': 'Deel II|Deel II/E|Deel II/E.6|9180-9189',
                  'count': 10,
                },
              ],
              'value': 'Deel II|Deel II/E|Deel II/E.6',
              'count': 12,
            },
            {
              'name': 'Deel II/E.2',
              'children': [
                {
                  'name': '7604-7608',
                  'children': [],
                  'value': 'Deel II|Deel II/E|Deel II/E.2|7604-7608',
                  'count': 5,
                },
                {
                  'name': '7601-7603',
                  'children': [],
                  'value': 'Deel II|Deel II/E|Deel II/E.2|7601-7603',
                  'count': 3,
                },
              ],
              'value': 'Deel II|Deel II/E|Deel II/E.2',
              'count': 10,
            },
            {
              'name': 'Deel II/E.3',
              'children': [
                {
                  'name': '7610-7617',
                  'children': [],
                  'value': 'Deel II|Deel II/E|Deel II/E.3|7610-7617',
                  'count': 8,
                },
              ],
              'value': 'Deel II|Deel II/E|Deel II/E.3',
              'count': 8,
            },
          ],
          'value': 'Deel II|Deel II/E',
          'count': 1663,
        },
        {
          'name': 'Deel II/G',
          'children': [
            {
              'name': 'Deel II/G.7',
              'children': [
                {
                  'name': 'div.nrs.',
                  'children': [
                    {
                      'name': '11008A-11008B',
                      'children': [],
                      'value': 'Deel II|Deel II/G|Deel II/G.7|div.nrs.|11008A-11008B',
                      'count': 2,
                    },
                    {
                      'name': '11013A-11013B',
                      'children': [],
                      'value': 'Deel II|Deel II/G|Deel II/G.7|div.nrs.|11013A-11013B',
                      'count': 2,
                    },
                  ],
                  'value': 'Deel II|Deel II/G|Deel II/G.7|div.nrs.',
                  'count': 404,
                },
                {
                  'name': '10818-10906',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.7|10818-10906',
                  'count': 88,
                },
                {
                  'name': '10474, 10917-10991',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.7|10474, 10917-10991',
                  'count': 69,
                },
                {
                  'name': '10907-10916',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.7|10907-10916',
                  'count': 10,
                },
                {
                  'name': '10707-10713',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.7|10707-10713',
                  'count': 7,
                },
                {
                  'name': '10811-10815',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.7|10811-10815',
                  'count': 5,
                },
                {
                  'name': '10809-10810',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.7|10809-10810',
                  'count': 2,
                },
                {
                  'name': '10816-10817',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.7|10816-10817',
                  'count': 2,
                },
              ],
              'value': 'Deel II|Deel II/G|Deel II/G.7',
              'count': 588,
            },
            {
              'name': 'Deel II/G.3',
              'children': [
                {
                  'name': 'div.nrs.',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|div.nrs.',
                  'count': 359,
                },
                {
                  'name': '10087-10105',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10087-10105',
                  'count': 20,
                },
                {
                  'name': '10123-10140',
                  'children': [
                    {
                      'name': '10129A-10129B',
                      'children': [],
                      'value': 'Deel II|Deel II/G|Deel II/G.3|10123-10140|10129A-10129B',
                      'count': 2,
                    },
                    {
                      'name': '10130A-10130B',
                      'children': [],
                      'value': 'Deel II|Deel II/G|Deel II/G.3|10123-10140|10130A-10130B',
                      'count': 2,
                    },
                  ],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10123-10140',
                  'count': 20,
                },
                {
                  'name': '10046, 10053-10068',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10046, 10053-10068',
                  'count': 17,
                },
                {
                  'name': '10116-10122',
                  'children': [
                    {
                      'name': '10119A-10119C',
                      'children': [],
                      'value': 'Deel II|Deel II/G|Deel II/G.3|10116-10122|10119A-10119C',
                      'count': 3,
                    },
                    {
                      'name': '10121A-10121B',
                      'children': [],
                      'value': 'Deel II|Deel II/G|Deel II/G.3|10116-10122|10121A-10121B',
                      'count': 2,
                    },
                  ],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10116-10122',
                  'count': 10,
                },
                {
                  'name': '10069-10078',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10069-10078',
                  'count': 9,
                },
                {
                  'name': '10141-10147',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10141-10147',
                  'count': 6,
                },
                {
                  'name': '10049-10051',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10049-10051',
                  'count': 3,
                },
                {
                  'name': '10070, 10079-10080',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10070, 10079-10080',
                  'count': 3,
                },
                {
                  'name': '10081-10083',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10081-10083',
                  'count': 3,
                },
                {
                  'name': '10084-10086',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10084-10086',
                  'count': 3,
                },
                {
                  'name': '10106-10108',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10106-10108',
                  'count': 3,
                },
                {
                  'name': '10113-10115',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10113-10115',
                  'count': 3,
                },
                {
                  'name': '10109-10110',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10109-10110',
                  'count': 2,
                },
                {
                  'name': '10148-10149',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.3|10148-10149',
                  'count': 1,
                },
              ],
              'value': 'Deel II|Deel II/G|Deel II/G.3',
              'count': 467,
            },
            {
              'name': 'Deel II/G.4',
              'children': [
                {
                  'name': 'div.nrs.',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.4|div.nrs.',
                  'count': 210,
                },
              ],
              'value': 'Deel II|Deel II/G|Deel II/G.4',
              'count': 212,
            },
            {
              'name': 'Deel II/G.2',
              'children': [
                {
                  'name': 'div.nrs.',
                  'children': [
                    {
                      'name': '9626A-9626B',
                      'children': [],
                      'value': 'Deel II|Deel II/G|Deel II/G.2|div.nrs.|9626A-9626B',
                      'count': 2,
                    },
                  ],
                  'value': 'Deel II|Deel II/G|Deel II/G.2|div.nrs.',
                  'count': 81,
                },
                {
                  'name': '9721-9731',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.2|9721-9731',
                  'count': 11,
                },
                {
                  'name': '9709-9714',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.2|9709-9714',
                  'count': 6,
                },
                {
                  'name': '9715-9719',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.2|9715-9719',
                  'count': 5,
                },
              ],
              'value': 'Deel II|Deel II/G|Deel II/G.2',
              'count': 108,
            },
            {
              'name': 'Deel II/G.1',
              'children': [
                {
                  'name': 'div.nrs.',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.1|div.nrs.',
                  'count': 64,
                },
                {
                  'name': '9617-9622',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.1|9617-9622',
                  'count': 6,
                },
                {
                  'name': '9553, 9560',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.1|9553, 9560',
                  'count': 2,
                },
                {
                  'name': '9623-9624',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.1|9623-9624',
                  'count': 2,
                },
                {
                  'name': '9556, 9559',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.1|9556, 9559',
                  'count': 1,
                },
                {
                  'name': '9559, 9585',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.1|9559, 9585',
                  'count': 1,
                },
              ],
              'value': 'Deel II|Deel II/G|Deel II/G.1',
              'count': 79,
            },
            {
              'name': 'Deel II/G.5',
              'children': [
                {
                  'name': 'div.nrs.',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.5|div.nrs.',
                  'count': 21,
                },
                {
                  'name': '10419, 10426-10431',
                  'children': [],
                  'value': 'Deel II|Deel II/G|Deel II/G.5|10419, 10426-10431',
                  'count': 7,
                },
              ],
              'value': 'Deel II|Deel II/G|Deel II/G.5',
              'count': 31,
            },
            {
              'name': 'Deel II/G.6',
              'children': [],
              'value': 'Deel II|Deel II/G|Deel II/G.6',
              'count': 1,
            },
          ],
          'value': 'Deel II|Deel II/G',
          'count': 1486,
        },
        {
          'name': 'Deel II/F',
          'children': [
            {
              'name': '9331, 9337-9518',
              'children': [],
              'value': 'Deel II|Deel II/F|9331, 9337-9518',
              'count': 181,
            },
            {
              'name': '9224, 9273-9331',
              'children': [],
              'value': 'Deel II|Deel II/F|9224, 9273-9331',
              'count': 57,
            },
            {
              'name': '9224-9282, 9329-9331',
              'children': [],
              'value': 'Deel II|Deel II/F|9224-9282, 9329-9331',
              'count': 48,
            },
            {
              'name': '9192-9220',
              'children': [],
              'value': 'Deel II|Deel II/F|9192-9220',
              'count': 29,
            },
            {
              'name': '9529-9540',
              'children': [],
              'value': 'Deel II|Deel II/F|9529-9540',
              'count': 12,
            },
            {
              'name': '9329-9336',
              'children': [],
              'value': 'Deel II|Deel II/F|9329-9336',
              'count': 7,
            },
            {
              'name': '9221-9222',
              'children': [],
              'value': 'Deel II|Deel II/F|9221-9222',
              'count': 2,
            },
            {
              'name': '9519-9520',
              'children': [],
              'value': 'Deel II|Deel II/F|9519-9520',
              'count': 2,
            },
            {
              'name': '9523-9525',
              'children': [],
              'value': 'Deel II|Deel II/F|9523-9525',
              'count': 2,
            },
            {
              'name': '9526-9527',
              'children': [],
              'value': 'Deel II|Deel II/F|9526-9527',
              'count': 2,
            },
          ],
          'value': 'Deel II|Deel II/F',
          'count': 346,
        },
        {
          'name': 'Deel II/K',
          'children': [
            {
              'name': 'Deel II/K.2',
              'children': [
                {
                  'name': 'Deel II/K.2.c',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel II|Deel II/K|Deel II/K.2|Deel II/K.2.c|div.nrs.',
                      'count': 1,
                    },
                  ],
                  'value': 'Deel II|Deel II/K|Deel II/K.2|Deel II/K.2.c',
                  'count': 1,
                },
              ],
              'value': 'Deel II|Deel II/K|Deel II/K.2',
              'count': 1,
            },
            {
              'name': 'Deel II/K.3',
              'children': [
                {
                  'name': 'Deel II/K.3.i',
                  'children': [
                    {
                      'name': '9634, 13509-13571',
                      'children': [],
                      'value': 'Deel II|Deel II/K|Deel II/K.3|Deel II/K.3.i|9634, 13509-13571',
                      'count': 1,
                    },
                  ],
                  'value': 'Deel II|Deel II/K|Deel II/K.3|Deel II/K.3.i',
                  'count': 1,
                },
              ],
              'value': 'Deel II|Deel II/K|Deel II/K.3',
              'count': 1,
            },
          ],
          'value': 'Deel II|Deel II/K',
          'count': 2,
        },
      ],
      'value': 'Deel II',
      'count': 3497,
    },
    {
      'name': 'Deel I',
      'children': [
        {
          'name': 'Deel I/E',
          'children': [
            {
              'name': 'Deel I/E.5',
              'children': [
                {
                  'name': 'Deel I/E.5.a',
                  'children': [
                    {
                      'name': '1056-3986',
                      'children': [
                        {
                          'name': '-',
                          'children': [],
                          'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.a|1056-3986|-',
                          'count': 7,
                        },
                        {
                          'name': '1457A-1457C',
                          'children': [],
                          'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.a|1056-3986|1457A-1457C',
                          'count': 3,
                        },
                        {
                          'name': '1604A-1604C',
                          'children': [],
                          'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.a|1056-3986|1604A-1604C',
                          'count': 3,
                        },
                        {
                          'name': '1615A-1615C',
                          'children': [],
                          'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.a|1056-3986|1615A-1615C',
                          'count': 3,
                        },
                      ],
                      'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.a|1056-3986',
                      'count': 2933,
                    },
                    {
                      'name': '1053-1055',
                      'children': [],
                      'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.a|1053-1055',
                      'count': 3,
                    },
                  ],
                  'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.a',
                  'count': 2937,
                },
                {
                  'name': 'Deel I/E.5.b',
                  'children': [
                    {
                      'name': '3988-4360',
                      'children': [],
                      'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.b|3988-4360',
                      'count': 371,
                    },
                    {
                      'name': '4367-4373',
                      'children': [],
                      'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.b|4367-4373',
                      'count': 7,
                    },
                    {
                      'name': '4361-4366',
                      'children': [],
                      'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.b|4361-4366',
                      'count': 6,
                    },
                  ],
                  'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.b',
                  'count': 384,
                },
                {
                  'name': 'Deel I/E.5.c',
                  'children': [
                    {
                      'name': 'div.nrs.',
                      'children': [],
                      'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.c|div.nrs.',
                      'count': 76,
                    },
                  ],
                  'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.c',
                  'count': 76,
                },
                {
                  'name': 'Deel I/E.5.d',
                  'children': [
                    {
                      'name': '4448-4454',
                      'children': [],
                      'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.d|4448-4454',
                      'count': 7,
                    },
                  ],
                  'value': 'Deel I|Deel I/E|Deel I/E.5|Deel I/E.5.d',
                  'count': 8,
                },
              ],
              'value': 'Deel I|Deel I/E|Deel I/E.5',
              'count': 3405,
            },
          ],
          'value': 'Deel I|Deel I/E',
          'count': 3405,
        },
      ],
      'value': 'Deel I',
      'count': 3405,
    },
  ],
  );
}
