import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  axios  from 'axios';
import uploadImage from '../../assets/upload-image.png';
import '../../common/styles.css';
import { BASE_URL } from '../../api/constants';
import { useUserContext } from '../../contexts/UserContext';

export default function ListPet() {
    const [name, setName] = useState('');
    const [animal, setAnimal] = useState('');
    const [gender, setGender] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [breed, setBreed] = useState('');
    const [birthday, setBirthday] = useState('');
    const [caretaker, setCaretaker] = useState('');
    const [vaccine, setVaccine] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const [nameError, setNameError] = useState('');
    const [animalError, setAnimalError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [colorError, setColorError] = useState('');
    const [sizeError, setSizeError] = useState('');
    const [breedError, setBreedError] = useState('');
    const [birthdayError, setBirthdayError] = useState('');
    const [caretakerError, setCaretakerError] = useState('');
    const [vaccineError, setVaccineError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [imageError, setImageError] = useState('');
    
    const {user, isLoaded} = useUserContext()

    const bearerToken = localStorage.getItem('access_token');


    const navigate = useNavigate();

    useEffect(()=>{
      if (isLoaded && user?.type != "shelter") {
        navigate('/404')
      }
    }, [user, isLoaded])

    const handleSubmit = async (e) => {
        // for custom form logic
        // https://stackoverflow.com/questions/39809943/react-preventing-form-submission
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('animal', animal);
        formData.append('breed', breed);
        formData.append('gender', gender);
        formData.append('color', color);
        formData.append('size', size);
        formData.append('birthday', birthday);
        formData.append('caretaker', caretaker);
        formData.append('vaccine', vaccine);
        formData.append('description', description);
        if (image) {
          formData.append('profile_image', image);
        }

        try {
            const res = await axios.post(
                `${BASE_URL}pets/pet/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                        'Content-Type': 'multipart/form-data',
                      },
                }
            )
            // let resData = res.data;
            // if (res.data.status === 400) {
            //     // TODO: redirect to shelter page
            //     navigate('/testHome/')
            // }
            console.log(res.data);
            navigate('/profile/');
        } catch (err) {
            console.log(err.response);
            const { data } = err.response;
            setNameError(data.name ? data.name[0] : '');
            setAnimalError(data.animal ? data.animal[0] : '');
            setGenderError(data.gender ? data.gender[0] : '');
            setColorError(data.color ? data.color[0] : '');
            setSizeError(data.size ? data.size[0] : '');
            setBreedError(data.breed ? data.breed[0] : '');
            setBirthdayError(data.birthday ? data.birthday[0] : '');
            setCaretakerError(data.caretaker ? data.caretaker[0] : '');
            setVaccineError(data.vaccine ? data.vaccine[0] : '');
            setDescriptionError(data.description ? data.description[0] : '');
            setImageError(data.image ? data.image[0] : '');
        }
    }

    return (
    <>
    <div className="content-container">
    <main style={{paddingBottom:30}}>
      <div className="row mt-5 mx-auto">
        {/* form */}
        <h3 className="mb-5 fw-bold">List a new pet for adoption</h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    id="name" 
                    placeholder="Name" 
                    onChange={(e) => setName(e.target.value)}
                />
              </div>
              { nameError && <div className="text-danger mb-3 mt-n3">{nameError}</div>}

              <div className="mb-3">
                <select 
                    name="animal" 
                    className="form-select bg-zinc-100 text-zinc-500" 
                    id="animal"
                    onChange={(e) => setAnimal(e.target.value)}
                    defaultValue={''}
                >
                  <option value="" disabled>Select animal</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bear">Bear</option>
                  <option value="turtle">Turtle</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="snake">Snake</option>
                  <option value="lizard">Lizard</option>
                  <option value="hamster">Hamster</option>
                  <option value="other">Other</option>
                </select>
              </div>
              { animalError && <div className="text-danger mb-3 mt-n3">{animalError}</div>}

              <div className="mb-3">
                <select 
                    name="gender" 
                    className="form-select bg-zinc-100 text-zinc-500" 
                    id="gender"
                    onChange={(e) => setGender(e.target.value)}
                    defaultValue={'Select gender'}
                >
                  <option value=" disabled">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              { genderError && <div className="text-danger mb-3 mt-n3">{genderError}</div>}

              <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    id="color" 
                    placeholder="Color"
                    onChange={(e) => setColor(e.target.value)}    
                />
              </div>
              { colorError && <div className="text-danger mb-3 mt-n3">{colorError}</div>}

              <div className="mb-3">
                <select 
                    name="size" 
                    className="form-select bg-zinc-100 text-zinc-500" 
                    id="size"
                    onChange={(e) => setSize(e.target.value)}
                    defaultValue={'Select gender'}
                >
                  <option value=" disabled">Select size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              { sizeError && <div className="text-danger mb-3 mt-n3">{sizeError}</div>}

              <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    id="breed" 
                    placeholder="Breed (optional)"
                    onChange={(e) => setBreed(e.target.value)}    
                />
              </div>
              { breedError && <div className="text-danger mb-3 mt-n3">{breedError}</div>}

              <div className="mb-3">
                <input 
                    type="date" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    id="birthday" 
                    placeholder="Birthday (optional)"
                    onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
              { birthdayError && <div className="text-danger mb-3 mt-n3">{birthdayError}</div>}

              <div className="mb-3">
                <input 
                    type="text" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    id="caretaker" 
                    placeholder="Caretaker (optional)"
                    onChange={(e) => setCaretaker(e.target.value)}
                />
              </div>
              { caretakerError && <div className="text-danger mb-3 mt-n3">{caretakerError}</div>}

              <div className="mb-3">
                <textarea 
                    name="vaccine" 
                    id="vaccine" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    placeholder="Vaccination and Medical Information" 
                    style={{ height: '122px' }}
                    onChange={(e) => setVaccine(e.target.value)}>
                </textarea>
              </div>
              { vaccineError && <div className="text-danger mb-3 mt-n3">{vaccineError}</div>}


              <div className="mb-3">
                <textarea 
                    name="description" 
                    id="description" 
                    className="form-control bg-zinc-100 text-zinc-500" 
                    placeholder="Description" 
                    style={{ height: '177px' }}
                    onChange={(e) => setDescription(e.target.value)}>
                </textarea>
              </div>
              { descriptionError && <div className="text-danger mb-3 mt-n3">{descriptionError}</div>}

              <button type="submit" className="primary-button ps-5 pe-5 mb-md-0 mb-3">List pet</button>
            </div>
            <div className="col-md-6 col-12 mb-3 d-flex justify-content-center">
              <div className="flex-container">
                <input 
                    type="file" 
                    className="form-control bg-zinc-100 text-zinc-500 mt-md-0 mt-3"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        setImage(file);
                    }}    
                />
                { imageError && <div className="text-danger mb-3 mt-n3">{imageError}</div>}
                {/* <img src="upload-image.png" className="img-fluid mt-2" alt="upload-image placeholder" /> */}
                <img
                    src={image ? URL.createObjectURL(image) : uploadImage}
                    className='img-fluid mt-2'
                    alt='upload-image'
                />

                {/* <div className="extra-images">
                  <p className="mt-5">Extra Images</p>
                  <img src="upload-image.png" className="img-fluid" alt="upload-image placeholder" />
                </div> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
    </div>
    </>
    )
}

