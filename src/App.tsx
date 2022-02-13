import { useState } from 'react';
import './assets/styles/App.css';

import {
  BreedType,
  Services,
} from './services';
import { debounce } from './utils';
import defaultImage from './assets/defaultImage.svg';

const sortAttrOptions = [
  { value: 'name', label: 'Name' },
  { value: 'weight', label: 'Weight' },
  { value: 'life_span', label: 'Life Span' },
];

const App = () => {
  const [breedsList, setBreedsList] = useState<BreedType[]>([]);
  const [sortAttr, setSortAttr] = useState<string>(sortAttrOptions[0].value);
  const [isDescOrder, setDescOrder] = useState<Boolean>(false);

  const searchName = (searchResult: string) => {
    if (searchResult.length >= 3) {
      Services.getBreedsSearch(searchResult).then((breeds) => {
        setBreedsList(breeds);

        breeds.map((breed, index) => {
          if (breed.reference_image_id) {
            Services.getImagesSearch(breed.reference_image_id).then((image) => {
              const breedsWithImage = [...breeds];

              if (image) breedsWithImage[index].images = image;

              setBreedsList(breedsWithImage);
            });
          }
          return breed;
        })
      });
    }
  }

  const sorting = (sortResult: string) => {
    let sortData = [...breedsList];

    if (isDescOrder) {
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
      }
    }

    setBreedsList(sortData);
  };

  return (
    <div className="App">
      <header className="App-header">
        Looking for Cat?
      </header>
      <div className="App-body">
        {/*input-field div*/}
        <input
          className="input-field"
          name="search"
          type='text'
          placeholder='Search for a Breed by name'
          onChange={debounce((e) => searchName(e.target.value), 1000)}
        />
        {/*sorting-attributes div*/}
        <div className="sorting-attributes">
          Sorting Attributes:
          <select className="select" onChange={(e) => setSortAttr(e.target.value)}>
            {
              sortAttrOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))
            }
          </select>
          <input
            type="checkbox"
            id="setDescOrder"
            name="setDescOrder"
            onClick={() => setDescOrder(!isDescOrder)}
          />
          <label htmlFor="setDescOrder">Descending Order</label>
          <button onClick={() => sorting(sortAttr)}>
            Sort
          </button>
        </div>
        {/*listing div*/}
        {
          breedsList.length > 0 ?
            <div className="listing">
              {
                breedsList.map(breed => (
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
