import { useState } from 'react';
import './assets/styles/App.css';

import {
  BreedType,
  Services,
} from './services';
import { debounce } from './utils';
import defaultImage from './assets/defaultImage.svg';

const App = () => {
  const [breeds, getBreeds] = useState<BreedType[]>([]);
  const [searchSort, getSearchSort] = useState<string>('name');
  const [isSorting, getSorting] = useState<Boolean>(false);

  const searchName = (searchResult: string) => {
    if (searchResult.length >= 1) {
      Services.getBreedsSearch(searchResult).then((resBreeds) => {
        getBreeds(resBreeds);

        resBreeds.map((breed, index) => {
          if (breed.reference_image_id) {
            Services.getImagesSearch(breed.reference_image_id).then((image) => {
              const breedsWithImage = [...resBreeds];

              if (image) breedsWithImage[index].images = image;

              getBreeds(breedsWithImage);
            });
          }
          return breed;
        })
      });
    }
  }

  const sorting = (sortResult: string) => {
    let sortData = [...breeds];

    if (isSorting) {
      switch (sortResult) {
        case 'name':
          sortData.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'weight':
          sortData.sort((a, b) => (
            Number(b.weight ? b.weight.imperial.split('-')[0] : -Infinity)
            - Number(a.weight ? a.weight.imperial.split('-')[0] : -Infinity)
          ));
          break;
        case 'life_span':
          sortData.sort((a, b) => (
            Number(b.life_span ? b.life_span.split('-')[0] : -Infinity)
            - Number(a.life_span ? a.life_span.split('-')[0] : -Infinity)
          ));
          break;
        default:
          sortData.sort((a, b) => b.name.localeCompare(a.name));
      }
    }
    else {
      switch (sortResult) {
        case 'name':
          sortData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'weight':
          sortData.sort((a, b) => (
            Number(a.weight ? a.weight.imperial.split('-')[0] : Infinity) -
            Number(b.weight ? b.weight.imperial.split('-')[0] : Infinity)
          ));
          break;
        case 'life_span':
          sortData.sort((a, b) => (
            Number(a.life_span ? a.life_span.split('-')[0] : Infinity) -
            Number(b.life_span ? b.life_span.split('-')[0] : Infinity)
          ));
          break;
        default:
          sortData.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    getBreeds(sortData);
  };

  const selectOptions = [
    { value: 'name', label: 'Name' },
    { value: 'weight', label: 'Weight' },
    { value: 'life_span', label: 'Life Span' },
  ];

  return (
    <div className="App">
      <header className="App-header">
        Looking for Cat?
      </header>
      <div className="App-body">
        <input
          className="input-field"
          name="search"
          type='text'
          placeholder='Search for a Breed by name'
          onChange={debounce((e) => searchName(e.target.value), 1000)}
        />
        <div className="sorting-attributes">
          Sorting Attributes:
          <select className="select" onChange={(e) => getSearchSort(e.target.value)}>
            {
              selectOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))
            }
          </select>
          <input
            type="checkbox"
            id="getSorting"
            name="getSorting"
            onClick={() => getSorting(!isSorting)}
          />
          <label htmlFor="getSorting">Descending Order</label>
          <button onClick={() => sorting(searchSort)}>
            Sort
          </button>
        </div>
        {
          breeds.length > 0 ?
            <div className="listing">
              {
                breeds.map(breed => (
                  <div className="listing-content" key={breed.id}>
                    {
                      breed.reference_image_id ?
                        breed.images ?
                          <img
                            className="cat-image"
                            src={breed.images.url}
                            alt="img"
                          />
                          :
                          <div className="lds-dual-ring"></div>
                        :
                        <img
                          className="cat-image"
                          src={defaultImage}
                          alt="img"
                        />
                    }
                    <h4>{breed.name}</h4>
                    <div>Weight: </div>
                    <ul>
                      <li>imperial: {breed.weight ? breed.weight.imperial : "-"}</li>
                      <li>metric: {breed.weight ? breed.weight.metric : "-"}</li>
                    </ul>
                    <p>Life Span: {breed.life_span ? breed.life_span : "-"}</p>
                  </div>
                ))
              }
            </div>
            : <div className="empty-list">No Data</div>
        }
      </div>
    </div>
  );
}

export default App;
