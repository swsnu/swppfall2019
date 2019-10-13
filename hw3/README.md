# Homework 3 - Django

**Due: 10/27 (Sun) 18:00 (This is a hard deadline)**

## Django

In this assignment you will implement a backend service for the blog frontend that you have created in homework 2.
This is an **individual** assignment.

Through this assignment, you are expected to:

  - Build a RESTful API server with Django (2.2.6)
  - Understand how communication between the client and the server occurs
  - Test your Django application

### Comments on files

Our `myblog` project consists of a single app, `blog`.
Because we provide the url routing and setting of the project already, you are expected to update the `blog` app mainly.

### Features

As you have seen in homework 2, our blog has three models: User, Article, and Comment.

  - Each user should be able to sign up, sign in and sign out.
  - Only those users who are signed in are allowed to read or write articles and comments.
  - Users should be able to update or delete articles and comments only which they have created.

For the user model, you **must** use the [Django default user model](https://docs.djangoproject.com/en/2.2/topics/auth/) and the django authentication system to manage user authentication.
In homework 2, we didn't cover the real user authentication process.
Now with a proper backend, we can manage user sessions and authentication supported by Django.

For articles, you need to create a model named as `Article` that consists of following fields:

| Field name             | Type |
|------------------------|-----|
| `title`                | Char Field (max_length=64) |
| `content`              | Text Field |
| `author`               | Foreign Key |

The author must be a (foreign) key referring a User.

For comments, you need to create a model named as `Comment` that consists of following fields:

| Field name             | Type |
|------------------------|-----|
| `article`              | Foreign Key |
| `content`              | Text Field |
| `author`               | Foreign Key |

The article and author must be a (foreign) key referring an Article and a User.

To check whether you implemented your model correctly or not, please check the following code works well with your model implementation (in your test code or somewhere else).

```
  from .models import Article, Comment

  new_user = User.objects.create_user(username='swpp', password='iluvswpp')  # Django default user model
  new_article = Article(title='I Love SWPP!', content='Believe it or not', author=new_user)
  new_article.save()
  new_comment = Comment(article=new_article, content='Comment!', author=new_user)
  new_comment.save()
```

Detailed specifications of RESTful APIs are as following:

| API                    | GET | POST | PUT | DELETE |
|------------------------|-----|------|-----|--------|
| `api/signup`              | X | Create new user | X | X |
| `api/signin`              | X | Log in | X | X |
| `api/signout`             | Log out | X | X | X |
| `api/article`             | Get article list | Create new article | X | X |
| `api/article/:article_id`         | Get specified article | X | Edit specified article | Delete specified article |
| `api/article/:article_id/comment` | Get comments of specified article | Create comment on specified article | X | X |
| `api/comment/:comment_id`         | Get specified comment | X | Edit specified comment | Delete specified comment |

Note that the APIs are slightly different from that of homework 2. Since we have used simple json server backend, APIs were limited in homework 2.
In this assignment, we will implement a more RESTful API. 

POST and PUT requests should contain data using the JSON format in the body of the request.
For each model, the JSON format should look like:

  - User : `{username: string, password: string}`
  - Article : `{title: string, content: string}`
  - Comment : `{content: string}`

Also, the user information will be included in the `request` automatically. Check `request.user`.

For each API you should respond with the appropriate HTTP response code.
The list of response codes you should use is as follows:

  - `200` (Ok) : Request was responded successfully.
  - `201` (Created) : Request has created new resources successfully.
  - `204` (No Content) : Request was responded successfully but without any content.
  - `400` (Bad Request) : Failed to decode request body or failed to retrieve necessary key-value from json (`KeyError`).
  - `401` (Unauthorized) : Request requires authentication. This should be returned if you are requesting without signing in.
  - `403` (Forbidden) : Request is forbidden. This should be returned if your request tries to modify resources of which you are not the owner.
  - `404` (Not Found) : Requested resource is not found. 
  - `405` (Method not allowed) : Requested URL does not allow the method of the request.

Please make sure to implement your request methods under the following global specifications:

- For all non-allowed requests (X marked in the API table), response with `405` (and any information must not be modified).
- For all requests about article and comment without signing in, response with `401` (and any information must not be modified).
- For all requests about non-existing article and comment, response with `404` (and any information must not be modified).
- For all PUT and DELETE requests from non-author, response with `403` (and any information must not be modified). 

Among these global specifications, the prior specification has the higher priority. For example, if someone requests for a non-existing article without signing in, response with `401` instead of `404`.

Also, please make sure to implement your request methods under the following detailed specifications (in your `views.py`)

- POST `api/signup`:

  Create a user with the information given by request JSON body and response with `201`
- POST `api/signin`:

  Authenticate with the information given by request JSON body. If success, log-in (the authentication info should be changed properly) and response with `204`. If fail, response with `401`.
- GET `api/signout`:

  If the user is authenticated, log-out (the authentication info should be changed properly) and response with `204`. If not, response with `401`.
- GET `api/article`:

  Response with a JSON having a list of dictionaries for each article's `title`, `content`, and `author`. The value of the `author` must be the `id` of the author but not her `username`.
- POST `api/article`:

  Create an article with the information given by request JSON body and response with `201`. Posted article (with it's assigned id) should be included in response's content as JSON format. 
- GET `api/article/:article_id`:

  Response with a JSON having a dictionary for the target article's `title`, `content`, and `author`. The value of the `author` must be the `id` of the author but not her `username`.
- PUT `api/article/:article_id`:

  Update the target article with the information given by request JSON body and response with `200`. Updated article (with it's id) should be included in response's content as JSON format. 
- DELETE `api/article/:article_id`:

  Delete the target article and response with `200`. When deleting an article, all comments under the target article (but not any comments under other articles, of course) **must** be deleted also.
- GET `api/article/:article_id/comment`:

  Response with a JSON having a list of dictionaries for each comment's `article`, `content`, and `author`. The value of the `article` and the `author` must be the `id` of the article and the author but not the `title` and her `username`.
- POST `api/article/:article_id/comment`:

  Create a comment with the information given by request JSON body and response with `201`. Posted comment (with it's assigned id) should be included in response's content as JSON format. 
- GET `api/comment/:comment_id`:

  Response with a JSON having a dictionary for the target comment's `article`, `content`, and `author`. The value of the `article` and the `author` must be the `id` of the article and the author but not the `title` and her `username`.
- PUT `api/comment/:comment_id`:

  Update the target comment with the information given by request JSON body and response with `200`. Updated comment (with it's id) should be included in response's content as JSON format. 
- DELETE `api/comment/:comment_id`:

  Delete the target comment and response with `200`. When deleting a comment, other users, articles and comments **must** not be deleted also.

### Testing

You should also write tests to verify that your blog backend is implemented correctly.
Your tests should reach **100%** of both the statement coverage and the branch coverage.

You can check the coverage by:
  - Statement coverage : `coverage run --source='./blog' manage.py test`
  - Branch coverage : `coverage run --branch --source='./blog' manage.py test`

### Tips

In Django, it is rather complex to send request other than GET method with RESTful API due to the [CSRF token](https://docs.djangoproject.com/en/2.2/ref/csrf/).
To successfully handle such requests, try the following steps:

1. Before sending the request, send GET request to `/api/token`. The response will come with an empty content and will set the cookie `csrftoken` in your browser.
2. Send the POST request with a header containing `HTTP_X_CSRFTOKEN` as the value of the `csrftoken`.

For more detail, see `test_csrf` of the `blog/test.py` file in the skeleton code.
You may change this part if you have a better way of handling the CSRF token, but disabling the protection itself is **NOT** permitted.

To test your APIs, we recommend using ARC (Advanced REST Client). Check `arc.pdf` for detailed information.

## Grading

This assignment is composed of a total of 80 points.
We will test your Django code under Python 3.6.

  - User APIs (15 points)
  - Article APIs (20 points)
  - Comment APIs (20 points)
  - Django Testing (25 points)

Like HW 2, if some basic features are not implemented properly, many other test cases can fail. 
For example, if the signing-in process works badly, most of the cases above will fail.
We'll try to give some partial points in this case, but it might not be enough.

## Submission

**Due: 10/27 (Sun) 18:00 (This is a hard deadline)**

We will check the snapshot of the *master* branch of your Github repository at the deadline and grade it.
Please name your repository as `swpp-hw3-YOUR_USERNAME`, and replace YOUR_USERNAME with you own GitHub username.
Refer to HW1 to create another private repository. (Make sure to push your work on Github on time and add `ktaebum`, `kyunggeun-lee`, and `hy00nc` as a collaborator in your repository settings.)
Also, make sure to push your work on Github on time. 
You won't need to send us an email for submission, but we will pull each repositories at the time specified.

Please put your django projects in the root folder (not inside another `hw3` or `skeleton` folder) appropriately.
Your directory hierarchy should look like this:
```
repository_root/
  README.md (this file)
  blog/
    ...
  myblog/
    ...
  manage.py
  ...
```
