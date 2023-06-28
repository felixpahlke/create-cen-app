FROM registry.access.redhat.com/ubi8/python-39:1-24

WORKDIR /opt/app-root

USER root

USER 1001
RUN chown -R 1001:0 ./ && \
    chmod -R g=u ./

ADD --chown=1001:0 requirements/common.txt  requirements/common.txt
ADD --chown=1001:0 requirements/prod.txt    requirements/prod.txt
RUN pip install -r requirements/prod.txt


ADD --chown=1001:0 app app

EXPOSE 4000

# required for Windows to ensure script can be called
RUN chmod +x app/start.sh

CMD ["app/start.sh"]
