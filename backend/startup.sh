#!/bin/bash

sudo apt install python3.8 python3-pip python3.8-venv

python3 -m venv env

chmod a+rwx ./run.sh
chmod a+rwx ./petpal/manage.py

source ./env/bin/activate

pip install -r ./requirements.txt

python3 ./petpal/manage.py makemigrations
python3 ./petpal/manage.py migrate