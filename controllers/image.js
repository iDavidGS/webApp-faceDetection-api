const { json } = require('express');
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key APIkey"); //No borrar la palabra "Key" la llave de la api va en "APIkey / Don´t delete the word "Key" the api key goes in "APIkey"

const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            model_id: "a403429f2ddf4b49b307e318f00e528b",
            inputs: [{ data: { image: { url: req.body.input } } }]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error: " + err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Estado fallido recibido: " + response.status.description + "\n" + response.status.details);
                return;
            }

            console.log("Conceptos pronosticados, con valores de confianza:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            res.json(response)
        }
    );
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('No se puede obtener entradas'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};