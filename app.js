import express from "express";
import Product from "./models/Product.js";

const app = express();
const PORT =  process.env.PORT || 3333
const dbURI = process.env.MONGO_URI;

// Connection to MongoDB
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Successfully conncted to MongoDB");
  })
  .catch((err) => {
    console.error("Failed connecting to MongoDB", err);
  });




// Создаём POST-маршрут для добавления нового продукта.
// async нужен, потому что сохранение в MongoDB — асинхронная операция.
app.post("/products", async (req, res) => {
  try {
    // Получаем из тела запроса три поля:
    // name — название продукта,
    // price — цена,
    // category — категория.
    const { name, price, category } = req.body;

    // Создаём новый документ с помощью модели Product.
    // Mongoose проверит данные по схеме ProductSchema.
    // Если валидация пройдёт, документ сохранится в MongoDB.
    // await ожидает завершения операции.
    const product = await Product.create({
      name,
      price,
      category,
    });

    // Если продукт успешно создан,
    // отправляем клиенту HTTP-статус 201 Created.
    return res.status(201).json({
      message: "Product created successfully",

      // Возвращаем созданный продукт вместе с его _id.
      product,
    });

  } catch (error) {
    // catch выполняется, если внутри try произошла ошибка.

    // Выводим подробности ошибки в терминал VS Code.
    console.error("Error creating product:", error);

    // Проверяем, связана ли ошибка с валидацией Mongoose.
    // Например, не передано обязательное поле name.
    if (error.name === "ValidationError") {
      return res.status(400).json({
        // Отправляем клиенту описание ошибки.
        message: error.message,
      });
    }

    // Если произошла другая ошибка,
    // возвращаем статус 500 — ошибка сервера.
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

 // READ — получение всех продуктов
app.get("/products", async (req, res) => {
  try {
    // Получаем параметры из URL запроса.
    // category — категория продукта.
    // sort — направление сортировки по цене.
    const { category, sort } = req.query;

    // Создаём пустой объект для фильтрации.
    // Если категория не указана, получим все продукты.
    const filter = {};

    // Если категория передана в URL,
    // добавляем её в объект фильтра.
    if (category) {
      filter.category = category;
    }

    // Определяем направление сортировки.
    // 1 — по возрастанию цены.
    // -1 — по убыванию цены.
    const sortOrder = sort === "desc" ? -1 : 1;

    // Ищем продукты в MongoDB.
    // find(filter) — применяем фильтр.
    // sort() — сортируем по цене.
    // await — ожидаем результат запроса.
    const products = await Product.find(filter)
      .sort({ price: sortOrder });

    // Возвращаем список продуктов клиенту.
    return res.status(200).json(products);

  } catch (error) {
    // Если произошла ошибка, выводим её в терминал.
    console.error("Error getting products:", error);

    // Отправляем сообщение об ошибке клиенту.
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});


 // UPDATE — обновление продукта по ID
app.put("/products/:id", async (req, res) => {
  try {
    // Получаем ID продукта из параметров URL.
    const { id } = req.params;

    // Получаем новые данные продукта из тела запроса.
    const { name, price, category } = req.body;

    // Ищем продукт по ID и обновляем его данные.
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        category,
      },
      {
        // Возвращаем документ после обновления.
        new: true,

        // Проверяем новые данные по схеме Mongoose.
        runValidators: true,
      }
    );

    // Если продукт с таким ID не найден.
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Возвращаем обновлённый продукт.
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    // Выводим ошибку в терминал.
    console.error("Error updating product:", error);

    // Если ID имеет неправильный формат
    // или данные не прошли валидацию.
    if (
      error.name === "CastError" ||
      error.name === "ValidationError"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    // Другие ошибки сервера.
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
  
 
 // DELETE — удаление продукта по ID
app.delete("/products/:id", async (req, res) => {
  try {
    // Получаем ID продукта из URL
    const { id } = req.params;

    // Ищем продукт по ID и удаляем его из MongoDB
    // await ожидает завершения операции
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Если продукт не найден, метод вернёт null
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Если продукт успешно удалён
    console.log("Product was successfully deleted");

    // Отправляем клиенту статус 200
    // и информацию об удалённом продукте
    return res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });

  } catch (error) {
    // Выводим ошибку в терминал
    console.error("Error deleting product by ID:", error);

    // Если ID имеет неправильный формат
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // Если произошла другая ошибка
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});





app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
 });