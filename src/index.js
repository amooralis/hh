import * as React from "react";
import {useEffect, useState} from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, Link, RouterProvider, useNavigate, useParams} from "react-router-dom";
import './App.css';
import axios from 'axios';
import i1 from "./1.png"
import i2 from "./2.png"
import i3 from "./3.png"
import i4 from "./4.png"
import i5 from "./people.png"

const router = createBrowserRouter([{
    path: "/signup", element: <SignUp/>,
}, {
    path: "/company-signup", element: <CompanySignUp/>,
}, {
    path: "/login", element: <Login/>,
}, {
    path: "/vacancies", element: <AllVacancies/>,
}, {
    path: "/vacancies/:id", element: <VacancyByIdPage allvacancies={true}/>,
}, {
    path: "/my-vacancies", element: <MyVacancies/>,
}, {
    path: "/my-vacancies/:id", element: <VacancyByIdPage allvacancies={false}/>,
}, {
    path: "/create-vacancy", element: <CreateVacancy/>,
}, {
    path: "/active-vacancies", element: <AllVacancies activevacancies={true}/>,
},]);

function SignUp() {
    return (<div className="form">
        <div className="sign-up">
            <label>Name</label>
            <input id="name-input"/>
            <label>Login</label>
            <input id="login-input"/>
            <label>Password</label>
            <input type="password" id="password-input"/>
            <label>Repeat password</label>
            <input type="password" id="second-password-input"/>
            <p>Already have an account? <a href="http://localhost:3000/login">Sign In</a></p>
            <button onClick={create_new_user}>Sign Up</button>
        </div>
    </div>);
}

function create_new_user() {
    const name = document.getElementById("name-input").value;
    const login = document.getElementById("login-input").value;
    const password_1 = document.getElementById("password-input").value;
    const password_2 = document.getElementById("second-password-input").value;

    if (password_1 === password_2) {
        const newUser = {
            name: name, login: login, password: password_1, isWorker: true
        };

        fetch("http://localhost:3456/signup", {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(newUser),
        })
            .then((response) => response.json())
            .then(() => {
                window.location.href = `http://localhost:3000/vacancies`;
            })
            .catch((error) => {
                console.error("Ошибка при создании пользователя.", error);
            });
    } else {
        alert("Пароли не совпадают");
    }
}

function create_new_company() {
    const name = document.getElementById("name-input").value;
    const login = document.getElementById("login-input").value;
    const password_1 = document.getElementById("password-input").value;
    const password_2 = document.getElementById("second-password-input").value;

    if (password_1 === password_2) {
        const newUser = {
            name: name, login: login, password: password_1, isWorker: false
        };

        fetch("http://localhost:3456/signup", {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(newUser),
        })
            .then((response) => response.json())
            .then(() => {
                window.location.href = `http://localhost:3000/vacancies`;
            })
            .catch((error) => {
                console.error("Ошибка при создании компании.", error);
            });
    } else {
        alert("Пароли не совпадают");
    }
}

function CompanySignUp() {
    return (<div className="form">
        <div className="sign-up">
            <label>Copmany name</label>
            <input id="name-input"/>
            <label>Login</label>
            <input id="login-input"/>
            <label>Password</label>
            <input type="password" id="password-input"/>
            <label>Repeat password</label>
            <input type="password" id="second-password-input"/>
            <p>Already have an account? <a href="http://localhost:3000/login">Sign In</a></p>
            <button onClick={create_new_company}>Sign Up</button>
        </div>
    </div>);
}

function login_user() {
    const login = document.getElementById("login-input").value;
    const password_1 = document.getElementById("password-input").value;
    const tryUser = {
        login: login, password: password_1
    }

    fetch("http://localhost:3456/login", {
        method: "POST", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify(tryUser),
    })
        .then((response) => response.json())
        .then((data) => {
            window.location.href = `http://localhost:3000/vacancies`;
            localStorage.setItem("userId", data.id);
            localStorage.setItem("isWorker", data.isWorker);
        })
        .catch((error) => {
            console.error("Ошибка при входе.", error);
        });

}

function Login() {
    return (<div className="form">
        <div className="sign-up">
            <label>Login</label>
            <input id="login-input"/>
            <label>Password</label>
            <input type="password" id="password-input"/>
            <p>New to BestVacancies? <a href="http://localhost:3000/signup">Create an account</a></p>
            <button onClick={login_user}>Login</button>
        </div>
    </div>);
}

function logout_user() {
    fetch("http://localhost:3456/logout")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(() => {
            window.location.href = `http://localhost:3000/login`;

        })
        .catch((error) => {
            console.error("Ошибка при выходе.", error);
        });
}

function redirect_to_vacancies() {
    window.location.href = `http://localhost:3000/vacancies`;
}

function redirect_to_active_vacancies() {
    window.location.href = `http://localhost:3000/active-vacancies`;
}

function redirect_to_create_vacancy() {
    window.location.href = `http://localhost:3000/create-vacancy`;
}

function redirect_to_my_vacancies() {
    window.location.href = `http://localhost:3000/my-vacancies`;
}

function UserMenu() {
    return (
        <div className="menu">
            <div className="menu-item">
                <img onClick={redirect_to_vacancies} src={i3} alt="картинка"/>
                <p>Vacancies</p>
            </div>
            <div className="menu-item">
                <img onClick={redirect_to_my_vacancies} src={i2} alt="картинка"/>
                <p>My vacancies</p>
            </div>
            <div className="menu-item">
                <img onClick={logout_user} src={i1} alt="картинка"/>
                <p>Logout</p>
            </div>
        </div>)
}

function CompanyMenu() {
    return (
        <div className="menu">
            <div className="menu-item">
                <img onClick={redirect_to_vacancies} src={i3} alt="картинка"/>
                <p>Vacancies</p>
            </div>
            <div className="menu-item">
                <img onClick={redirect_to_active_vacancies} src={i2} alt="картинка"/>
                <p>Active vacancies</p>
            </div>
            <div className="menu-item">
                <img onClick={redirect_to_create_vacancy} src={i4} alt="картинка"/>
                <p>Create vacancy</p>
            </div>

            <div className="menu-item">
                <img onClick={logout_user} src={i1} alt="картинка"/>
                <p>Logout</p>
            </div>
        </div>)
}

const fetchVacancies = async () => {
    try {
        const user = {
            userId: localStorage.getItem("userId"),
            isWorker: localStorage.getItem("isWorker"),
        };

        const response = await axios.get("http://localhost:3456/vacancies", {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: user,
        });

        return response.data;

    } catch (error) {
        console.error("Ошибка при получении вакансий.", error);
    }
};

const fetchActiveVacancies = async () => {
    try {
        const response = await axios.get("http://localhost:3456/activevacancies", {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: {userId: localStorage.getItem("userId")}
        });
        return response.data;

    } catch (error) {
        console.error("Ошибка при получении активных вакансий.", error);
    }
};

const fetchAllActiveVacancies = async () => {
    try {
        const response = await axios.get("http://localhost:3456/allactivevacancies", {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response.data;

    } catch (error) {
        console.error("Ошибка при получении активных вакансий.", error);
    }
};
const fetchVacancy = async ({id}) => {
    try {
        const response = await fetch(`http://localhost:3456/vacancies/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при получении вакансии.", error);
    }
};


const fetchMyVacancies = async () => {
    try {
        const user = {
            workerId: localStorage.getItem("userId"),
            isWorker: localStorage.getItem("isWorker"),
        };

        const response = await axios.get("http://localhost:3456/myresponses", {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: user,
        });

        if (!response.data) {
            console.error("Ответ сервера не содержит данных:", response);
            return [];
        }

        return response.data;
    } catch (error) {
        console.error("Ошибка при получении вакансий:", error);
        return [];
    }
};


function useCheckResponse() {
    const updateVacancy = async (vacancy) => {
        let responded = false;

        if (vacancy.id) {
            const checkedVac = {
                vacancyId: vacancy.id,
                workerId: localStorage.getItem("userId")
            }

            const res = await axios.get("http://localhost:3456/responses", {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
                params: checkedVac,
            })
            responded = !!res.data;
        }
        return responded;
    }

    return {
        updateVacancy
    }
}

function useCountResponse() {
    const countResponses = async (vacancy) => {
        const data = 0;
        if (vacancy.id) {

            const response = await fetch(`http://localhost:3456/responses-count/${vacancy.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        }
        return data;
    }

    return {
        countResponses
    }
}

function VacanciesList({vacancies, allvacancies}) {
    const [respondedStates, setRespondedStates] = useState([]);
    const [respondedCount, setRespondedCount] = useState([]);

    const updateVacancy = useCheckResponse();
    const countResponses = useCountResponse();


    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const responses = await Promise.all(
                    vacancies.map(async (vacancy) => await updateVacancy.updateVacancy(vacancy))
                );
                setRespondedStates(responses);
            } catch (error) {
                console.error('Ошибка при получении откликов на вакансии.', error);
            }
        };

        const fetchCountResponses = async () => {
            try {
                const responses = await Promise.all(
                    vacancies.map(async (vacancy) => await countResponses.countResponses(vacancy))
                );
                setRespondedCount(responses);
            } catch (error) {
                console.error('Ошибка при подсчёте откликов на вакансии.', error);
            }
        };

        fetchResponses();
        fetchCountResponses();
    }, [vacancies]);

    return (
        <div className="all-vacancies">
            <ul>
                {vacancies.map((vacancy, index) => {
                    const isResponded = respondedStates[index] && respondedStates[index].isResponded;
                    const count = respondedCount[index] && respondedCount[index].responseCount;

                    return (
                        <Link
                            to={allvacancies ? `/vacancies/${vacancy.id}` : `/my-vacancies/${vacancy.id}`}
                            key={vacancy.id}
                            className="vacancy-link"
                        >
                            <div className="vacancy-card">
                                <li>
                                    <div className="first-line-in-all-vacancies">
                                        <h3>{vacancy.title}</h3>
                                        {isResponded && <p className="done">You responded</p>}
                                        {(localStorage.getItem("isWorker") === "false") &&
                                            <div className="count">
                                                <p>{count}</p>
                                                <img src={i5} alt="иконка"/>
                                            </div>}
                                    </div>
                                    <p>Стек: {vacancy.description}</p>
                                    <p>
                                        <b>{vacancy.salary} руб.</b>
                                    </p>
                                </li>
                            </div>
                        </Link>
                    );
                })}
            </ul>
        </div>
    );
}


function VacancyById({vacancy}) {
    const [responded, setResponded] = useState(false);
    const updateVacancy = useCheckResponse()

    useEffect(() => {
        updateVacancy.updateVacancy(vacancy)
            .then(data => {
                setResponded((data))
            })
    }, [updateVacancy, vacancy])

    return (
        <div className="vacancy-by-id-card">
            <div>
                <div className="first-line-in-card">
                    <h1>{vacancy.id} {vacancy.title}</h1>
                    <p className="english-lvl">English lvl: {vacancy.english_lvl}</p>
                    <p className="grade">Grade: {vacancy.grade}</p>
                </div>
                <p className="description">{vacancy.description}</p>
                <p className="salary"><b>{vacancy.salary} руб.</b></p>
                <div className="tags">
                    {vacancy.tags.map((tag, i) => (
                        <p key={i} className="tag">{tag}</p>
                    ))}</div>
            </div>
            <div className="response-div">
                {responded === false && localStorage.getItem("isWorker") === "true" && localStorage.getItem("isWorker") === 'true' && (
                    <button className="response" onClick={() => {
                        response_to_vacancy(vacancy)
                            .then(setResponded(true));
                    }}>Response</button>)}
                {responded === true && localStorage.getItem("isWorker") === "true" && (
                    <button className="cancel-response" onClick={() => {
                        cancel_response_to_vacancy(vacancy)
                            .then(setResponded(false));
                    }}>Cancel response</button>)}
                {localStorage.getItem("isWorker") === "false" && (<button className="close-vacancy" onClick={() => {
                    close_vacancy(vacancy)
                }}>Close vacancy</button>)}

            </div>
        </div>
    )
}

async function response_to_vacancy(vacancy) {
    if (!vacancy) {
        console.error("Ошибка: вакансия не определена.");
        return;
    }

    const newResponse = {
        workerId: localStorage.getItem("userId"),
        vacancyId: vacancy.id,
        isWorker: localStorage.getItem("isWorker"),
    };

    try {
        return await axios.post("http://localhost:3456/newresponse", newResponse, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    } catch (error) {
        console.error("Ошибка при отклике на вакансию.", error);
    }
}

async function cancel_response_to_vacancy(vacancy) {
    if (!vacancy) {
        console.error("Ошибка: вакансия не определена.");
        return;
    }

    const user = {
        workerId: localStorage.getItem("userId"),
        isWorker: localStorage.getItem("isWorker")
    };


    try {
        return await axios.delete(`http://localhost:3456/vacancies/${vacancy.id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            params: user,
        });
    } catch (error) {
        console.error("Ошибка при удалении отклика на вакансию.", error);
    }
}

async function close_vacancy(vacancy) {
    if (!vacancy) {
        console.error("Ошибка: вакансия не определена.");
        return;
    }

    try {
        return await axios.put(`http://localhost:3456/vacancies/${vacancy.id}`, {
            status: false,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
    } catch (error) {
        console.error("Ошибка при закрытии вакансии.", error);
    }
}


function AllVacancies({activevacancies}) {
    const [vacancies, setVacancies] = useState([]);
    useEffect(() => {
        if (activevacancies) {
            fetchActiveVacancies()
                .then(data => setVacancies(data))
        } else if (localStorage.getItem("isWorker") === 'true') {
            fetchAllActiveVacancies()
                .then(data => setVacancies(data))
        } else {
            fetchVacancies()
                .then(data => setVacancies(data))
        }
    }, [])

    return (
        <div className="page">
            {localStorage.getItem("isWorker") === 'false' ? (<CompanyMenu/>) : (<UserMenu/>)}
            <VacanciesList vacancies={vacancies} allvacancies={true}/>
        </div>);
}


function MyVacancies() {
    const [myvacancies, setMyVacancies] = useState([]);
    useEffect(() => {
        fetchMyVacancies()
            .then(data => setMyVacancies(data))
            .catch(error => {
                console.error("Ошибка при загрузке вакансий:", error);
                setMyVacancies([]);
            });
    }, []);


    return (
        <div className="page">
            {localStorage.getItem("isWorker") === 'false' ? (<CompanyMenu/>) : (<UserMenu/>)}
            <VacanciesList vacancies={myvacancies} allvacancies={false}/>
        </div>);
}

function VacancyByIdPage({allvacancies}) {
    const {id} = useParams();
    const [vacancy, setVacancy] = useState({
        id: '',
        title: '',
        english_lvl: '',
        grade: '',
        salary: 0,
        tags: [],
        description: ''
    });
    const [vacancies, setVacancies] = useState([]);

    useEffect(() => {
        fetchVacancies()
            .then(data => setVacancies(data))

        if (!allvacancies) {
            fetchMyVacancies()
                .then(data => setVacancies(data))
        }

        fetchVacancy({id})
            .then(vac => {
                setVacancy(vac)
            })
    }, [id])
    return (
        <div className="vacancy-id">
            {localStorage.getItem("isWorker") === 'false' ? (<CompanyMenu/>) : (<UserMenu/>)}
            <VacanciesList vacancies={vacancies} allvacancies={allvacancies}/>
            <VacancyById vacancy={vacancy}/>
        </div>);
}

async function create_vacancy({title, description, englishlvl, grade, tags, salary}) {
    const newVacancy = {
        company_id: localStorage.getItem("userId"),
        isWorker: localStorage.getItem("isWorker"),
        title: title,
        description: description,
        english_lvl: englishlvl,
        grade: grade,
        tags: tags,
        salary: salary,
    };

    try {
        await axios.post("http://localhost:3456/vacancies", newVacancy, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        window.location.href = `http://localhost:3000/vacancies`;
    } catch (error) {
        console.error("Ошибка при создании вакансии.", error);
    }
}

function CreateVacancy() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [englishlvl, setEnglishlvl] = useState('A1');
    const [grade, setGrade] = useState('Intern');
    const [tags, setTags] = useState([]);
    const [salary, setSalary] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("isWorker") === 'true') {
            navigate('/vacancies');
        }
    }, [navigate])

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };
    const handleEnglishlvlChange = (e) => {
        setEnglishlvl(e.target.value);
    };
    const handleGradeChange = (e) => {
        setGrade(e.target.value);
    };
    const handleTagsChange = (e) => {
        const selectedTags = Array.from(e.target.selectedOptions, (option) => option.value);
        setTags(selectedTags);
    };
    const handleSalaryChange = (e) => {
        setSalary(e.target.value);
    };

    const handleSaveClick = () => {
        create_vacancy({title, description, englishlvl, grade, tags, salary});
    };

    return (
        <div className="page">
            <CompanyMenu/>
            <div className="create-page">
                <div className="create-window">
                    <div className="create-form">
                        <p>Vacancy title</p>
                        <input value={title} onChange={handleTitleChange}/>
                        <p>Vacancy description</p>
                        <textarea value={description} onChange={handleDescriptionChange} className="description-input"/>
                        <div className="selectors">
                            <div className="one-of-selectors">
                                <p>English lvl</p>
                                <select value={englishlvl} onChange={handleEnglishlvlChange}>
                                    <option>A1</option>
                                    <option>A2</option>
                                    <option>B1</option>
                                    <option>B2</option>
                                    <option>C1</option>
                                    <option>C2</option>
                                </select></div>
                            <div className="one-of-selectors">
                                <p>Grade</p>
                                <select value={grade} onChange={handleGradeChange}>
                                    <option>Intern</option>
                                    <option>Junior</option>
                                    <option>Middle</option>
                                    <option>Senior</option>
                                    <option>TeamLead</option>
                                </select></div>
                        </div>

                        <p>Tags</p>
                        <select className="tag-selector" multiple="multiple" size="9" value={tags}
                                onChange={handleTagsChange}>
                            <option>Frontend</option>
                            <option>Backend</option>
                            <option>JS</option>
                            <option>Go</option>
                            <option>React.js</option>
                            <option>Node.js</option>
                            <option>Java</option>
                            <option>Python</option>
                            <option>SQL</option>
                        </select>

                        <p>Salary</p>
                        <input value={salary} onChange={handleSalaryChange}/>
                    </div>

                    <div className="create-btns">
                        <button className="close-btn">Close</button>
                        <button className="save-btn" onClick={handleSaveClick}>Save</button>
                    </div>
                </div>
            </div>
        </div>);
}

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode>
    <RouterProvider router={router}/>
</React.StrictMode>);

