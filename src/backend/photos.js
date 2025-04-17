const fetch = require('node-fetch'); // Use node-fetch v2 for CommonJS compatibility
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config(); // Load environment variables from .env file

// Function to read and parse plant data from plants_info.json
function getPlantData() {
    const filePath = path.join(__dirname, '../../plants_info.json'); // Adjust the path as necessary
    try {
        const data = fs.readFileSync(filePath, 'utf8'); // Read the file synchronously
        return JSON.parse(data); // Parse and return the JSON content
    } catch (error) {
        console.error("Error reading or parsing plants_info.json:", error);
        throw error; // Re-throw the error for the caller to handle
    }
}

// Function to write updated plant data back to plants_info.json
function updatePlantData(updatedData) {
    const filePath = path.join(__dirname, '../../plants_info.json'); // Adjust the path as necessary
    try {
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8'); // Write the updated JSON data
        console.log("Updated plants_info.json successfully.");
    } catch (error) {
        console.error("Error writing to plants_info.json:", error);
        throw error; // Re-throw the error for the caller to handle
    }
}

// Function to fetch raw photo links from Unsplash
async function fetchPhotoLinks(plantData) {
    const accessKey = process.env.UNSPLASH_API_KEY; // Replace with your Unsplash API key
    const defaultPhotoLink = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQUDBAYCB//EADwQAAICAQIDBAYJAwIHAAAAAAABAgMEBRESITEGE0FRIjJhcYGRFCMzUqGxwdHhQmJyFZIkJjRDRFNk/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AProAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJI3XmAA3J2AgAAAAAAAAAAAAAAAAAAAAAAAAAAAA+T5georikl5kZ2dVg8MODik1uor9TJQt5Lfpt1Of1WxWZ9r3e0Xw/ICzjq+NN/W1Th7VzM0MrBn6t3C/7uRX4Oj2ZWOrXdGCl6q4dybdDyo+o4TXyAtlCM1vXOMviQ6ZrwKCeFmUPd1WL2x/giOdl0vbvrI+yfP8wL5xkusWvgefdzKyvW8mP2irs9y2NmOt0v7ahx9qe4G0D1jX4uXFypl06xfVE2Q4JNAeAAAAAAAAAAAAAAAAAY7b66l6cvS8vE1Lcyb3UPRQG7ZZGtbzexq2Z66VR39rRptyk/Sk37yPDYCz0+yclbZOXQ5+yTnOUn1bb/EvIvudInPxkm/0KTDh3uVVD700gOyxK+7xqofdgkZtguRIEbHmdVc1tOEZe9HsAaNuk4VvWiK/x5HP6vhLByFCuTcZR3W51pyvaG7i1KS33UIpIBoXF/qMWuii9y8v9drryKns1Ded1vkkkWc3vZJgeQAAAAAAAAAAAAAfoABW5y2yJNrk+hg22LDOr46t11XX3FeAHhy6g90Q474LwbA2NZkqdMhWuraj8jR7P197qdb8IJyMvaWxd5TX5Jya/BfkeuzDhU8nJtkoxhFR3fhuB1HQHO6j2i2brw48v/ZL9EbPZ3ULMqqdV8lK2D33figLoGK2+umLldZGCXi3sU2Z2kqjvHEh3j+9LlH9wL1s4bULu+zr5+Dm9iw0/OycrKnfkWt10VSnwrkvJFJxbvdvqB1PZ+Hd6dKb/rk2bAw4dzpdEOj4OfxAAAAAAAAAAAAAAAAABrdbefIqbId3ZKHk+RbGnqFfoqyPuYGkbWnR3yd30itzW6G/pMd1ZLzewFJr1vealavuJQ/DmbWBh25miTqxeFzlfxTjJ7PZLkU+Xb3uXdZ4Sm3+JFGTdjPix7JVt+TA3rtMzqPXxp8vGK4kYaL78O7vK5OuSW3OP7mxT2h1CrbexT/zibS7RwtW2Zg12J9Wv5Aq77rb58d05Tl5yZj8UXP0nQsj16raZPrsunyC0vAyP+j1Ktt/0za3/cDBi/UaNn3vrbKNcX+f5lbTW7La6l1lLZfMs9X7vE07HwI2QnYrHZZwPfby/M1tBr77VqF4QfG/h/OwHXZG0YxilskttjAZciW89jEAAAAAAAAAAAAAAAAAPNkVOEoS6SWx6AFPKLhJxfVcje02+EN4SaT33TZjzqmrFNJ7NfJmvVRZP1I/MDxm6A53SnhWQUZPi4H4e5lfbo2fD/x3Jf2Pc6GnF7t7ym2/7eSNuNko9GBw9tN1D2tqnD/KOxj3O/79yW04xfwNe3EwL/tsWpt+PDzA4jiIb3Oss7P6ZZu65W1P2S3XyZqW9l59aMuMvZOO35Ac8uSL7sjXxZl9v3K9l8X/AAatnZ3Ua36NULN31jP9zodF06WnYsu+ce8m95KPl5AZ5vecn7TyPeAAAAAAAAAAAAAAAAAAAAdR8vgPb4E7ctwIAHwAADcBtv4kpteY2I8NwPXHJdGw5uXVnkeOwAAAAAAAAAAAAAAAAAAAVPaHOycGuh4u2857STjvxLyMlmpKzRLs3FaU41N81u4yXVGHtA9r9Mf/ANP6Gjr2PZp0cm3Gi3iZcXC2PhCb8QN+3VLasDC4K1bmZSXBHot/M82vWsSp5FlmPkQj6Vlahs9vYzUtcsevR9QcXKmqHDYkt9k11LHM1nBhhzdV8LZSi1CEecm2vIDdw8iGXi15FXqWLdGpVl3y1zJxXJd1XQpxW3ietBxrMTSseu1bSScpLy3e5q0v/mjNXj9FX6AYuz+r5OZkzx8xriknKrZbb7PmiM/V8iGsV42M4qnjhXZLh33b8DQohOrRadSpW92LkSb28Yt7NGSeNLHxtMnb9tflK2b94F3reXbi0whir/iLbFCtNb+8aPmyy8NzyWlfTNwt5bbbFZm5F+Rr3Hi47yY4S4eFS2XE+rPOPPIq1fIrycf6Ms+D2i5JriS6/iBtVZWo6nxWYMqsbGUmozmuJzNzEt1CNORHPrhvXFuFkOk+XkVmm5FUNOlpeXkPDyKm1vvwvbfqmedNsc87MhXl3ZONChpWTfLi28wMum2a1n4kL68uiKlvylVz6l1jqxY9ayJKVu3pOK5N+Zyuk06VPT65ZedOu3nvGN223w2OowlVHEpjj2OdKjtCb58S89wMwAAAAAAAAAAAAAAAPM64WuPHBScXvHdb7E2QhbFwtipVtc4tFLrl2RfmVYOBbKFka5W2OL+SJtyLs/s4sjHslC+C4nwvm2uq/MC54IqvgUYqKWyjt+Bghg41VneQxqoz+8oIwQ1GH+jfT+X2Tlt/d02+ZqYmRbgdnp5eVZKVsoua3fi+iAunv4s8qqHeO3u13kls5bdUUeiW5NGb9EzrJTldTG2Dl4eaNmF1r7S3UuyXdLGUlDflv5gWSoqhW6o1xjCXWKjyZM6qp8PHXGXD6vLoVvZy2y7BsldZKclbJbyfgmZtay3habdZF7Wv0Ie9gbldVdTbrrUXLnLZbbvzIsqrtnGc4Rm4veLa9UqNEsyaMq7AzrXO3hVkZSfVNc0a9zd+u5tV2ozxaq1FwXGorfZefvAvMjEoyGnfRCzbpxR3MldVVUeCFcYx+6lsim0i66OpZWNDJeXiwr4u9b32l5brkZ+zttl+nynbNykrJrd+8Dc+g4fhi1f7EbEIRriowjwwXJJLZIotZnJ6xiUPNljUzrk5SUuHobWm01V3udeqSyWotd27FJe/kBZgAAAAAAAAAAAAAbUVxS6LmwAOb06rUsjJytQx5VVu6fCu+jz2Xl7DPokL8TUMrBylFq362LivRbfVIvQBybx73krRXCax3kd5x7f0dXzLDXo25eTi4GNBJL61tp8Oy6Jl6QBzmp06nTPH1DIlVZ9Hl/2ovfZ9Tao4pdpr7FCXBLETi2n4lyAOa0XU6cLFnTdXe5u2T9GpvxMuozv1PPxasRcMa49/xWxfDv4bnQADm82Go4ubjahkuu1RfBLuovfZ9dzHkSxIa/nz1DFndXOMeD6tyW/CuZ1I35bAc9o+z1S+zBotpwe59KMk0nL2JmLRdTpwcKVN9WRx95JvhqbW250xAHOazZjz1PCvyKJ2YsqW5R7tvr05G9pVumzyZRwsSdVri95Oprl5bstvDYgAAAAAAAAACQBAJAEAkAQCQBAJAEAkAQCQBAJAEAkAQCQBAJAEAkAQCQB//9k=";

    for (const plant of plantData) {
        const name = plant.name;
        if (!name) {
            console.error('Plant name is missing:', plant);
            continue;
        }

        try {
            // Connect to Unsplash API
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(name)}&per_page=1`, {
                headers: {
                    Authorization: `Client-ID ${accessKey}`,
                },
            });

            if (!response.ok) {
                console.error(`Failed to fetch photo for "${name}":`, response.statusText);
                plant.rawPhotoLink = defaultPhotoLink; // Use default photo link
                continue;
            }

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                plant.rawPhotoLink = data.results[0].urls.raw; // Get the raw photo link
            } else {
                console.warn(`No photos found for "${name}"`);
                plant.rawPhotoLink = defaultPhotoLink; // Use default photo link
            }
        } catch (error) {
            console.error(`Error fetching photo for "${name}":`, error);
            plant.rawPhotoLink = defaultPhotoLink; // Use default photo link
        }
    }

    return plantData;
}

// Example usage
(async () => {
    try {
        const plantData = getPlantData(); // Get plant data from plants_info.json
        const updatedPlantData = await fetchPhotoLinks(plantData); // Fetch photo links and update data
        updatePlantData(updatedPlantData); // Write updated data back to plants_info.json
    } catch (error) {
        console.error("Error in processing:", error);
    }
})();