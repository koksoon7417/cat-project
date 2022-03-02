import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  Services,
  BreedType,
} from '../../services';

const initialState: BreedType[] = [];

export const getBreedsAsync = createAsyncThunk<
  BreedType[],
  string
>(
  'breeds/getBreedsSearch',
  async (searchResult) => {
    return Services.getBreedsSearch(searchResult);
  }
);

export const getBreedImagesAsync = createAsyncThunk<
  BreedType[],
  void,
  { state: RootState }
>(
  'breeds/getBreedImages',
  async (_, thunkAPI) => {
    const { breeds } = thunkAPI.getState();
    const breedImagesPromises = await Promise.all(
      breeds.map(breed => {
        if (breed.reference_image_id) return Services.getImagesSearch(breed.reference_image_id);
        else return Promise.resolve();
      })
    );

    const breedsWithImage = [...breeds];

    breedImagesPromises.forEach((image, index) => {
      if (image) {
        breedsWithImage[index] = {
          ...breedsWithImage[index],
          images: image
        };
      }
    })

    return breedsWithImage;
  }
);

export const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {
    setBreeds: (state, action: PayloadAction<BreedType[]>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBreedsAsync.fulfilled, (state, action) => {
        return [...action.payload];
      })
      .addCase(getBreedImagesAsync.fulfilled, (state, action) => {
        return [...action.payload];
      });
  },
});

export const { setBreeds } = breedsSlice.actions;
export const selectBreeds = (state: RootState) => state.breeds;

export default breedsSlice.reducer;
