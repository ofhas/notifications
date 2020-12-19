FROM nginx:1.19-alpine

# copy the build folder from react to the root of nginx (www)

COPY dist/ /usr/share/nginx/html/
RUN ls -la /usr/share/nginx/html/*

# expose port 80 to the outer world

EXPOSE 80

# start nginx

CMD ["nginx", "-g", "daemon off;"]
