const helper = require("./helper.js");
const React = require("react");
const { createRoot } = require("react-dom/client");

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector("#domoName").value;
    const age = e.target.querySelector("#domoAge").value;
    const height = e.target.querySelector("#domoHeight").value;

    if (!name || !age || !height) {
        helper.handleError("All fields are required!");
        return false;
    }

    helper.sendPost(e.target.action, { name, age, height }, onDomoAdded);
    return false;
};

const DomoForm = (props) => (
    <form id="domoForm"
        onSubmit={(e) => handleDomo(e, props.triggerReload)}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
    >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name" />

        <label htmlFor="height">Height (inches): </label>
        <input id="domoHeight" type="number" min="0" name="height" />

        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="number" min="0" name="age" />

        <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
);

const DomoList = (props) => {
    const [domos, setDomos] = React.useState(props.domos);

    React.useEffect(() => {
        (async () => {
            const response = await fetch("/getDomos");
            const data = await response.json();
            setDomos(data.domos);
        })();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map((domo) => {
        const feet = Math.floor(domo.height / 12);
        const inches = domo.height - (feet * 12);

        console.log("height: ", domo.height);

        return (
            <div key={domo.id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" class="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoAge">Height: {feet}' {inches}"</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = React.useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById("app"));
    root.render(<App />);
};

window.onload = init;
