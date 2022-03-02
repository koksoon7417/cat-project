import breedsReducer, {
  setBreeds,
} from './breedsSlice';
import {
  BreedType,
} from '../../services';


describe('counter reducer', () => {
  const initialState: BreedType[] = [];
  const testData: BreedType = {
    id: 'sibe',
    name: 'Siberian',
    weight: {
      imperial: '8 - 16',
      metric: '4 - 7',
    },
    life_span: '12 - 15',
    reference_image_id: '3bkZAjRh1',
    images: {
      height: 2560,
      id: '3bkZAjRh1',
      url: 'https://cdn2.thecatapi.com/images/3bkZAjRh1.jpg',
      width: 4232,
    }
  };

  it('should handle initial state', () => {
    expect(breedsReducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  it('should handle set breeds', () => {
    const actual = breedsReducer(initialState, setBreeds([testData]));
    expect(actual.length).toEqual(1);

    const actual2 = breedsReducer(initialState, setBreeds([...actual, testData]));
    expect(actual2.length).toEqual(2);
  });
});
