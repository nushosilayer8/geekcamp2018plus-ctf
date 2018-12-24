from flask import Flask, render_template, render_template_string, escape

app = Flask(__name__)

def blacklist_replace(template):
    blacklist = ["[","]","config","self","from_pyfile","|","join","mro","class","request","pop","attr","args","+"]

    for b in blacklist:
        if b in template:
           template=template.replace(b,"")

    return template

@app.route("/")
def index_template():
    return "<div>I made a <a href='/src'>jail</a> around myself to keep me .. safe. Can you test out if I am jinja (*woops my korean is bad*) secure now? <a href='/jail/test'>See this</a><br>btw, you might not want to use a browser for this challenge, use postman etc</div>"

@app.route("/src")
def src():
    return "<pre>" + escape(open(__file__).read()) + "</pre>"

@app.route("/jail/<path:template>")
def blacklist_template(template):
    if len(template) > 10000:
        return "This is too long"

    while blacklist_replace(template) != template:
        template = blacklist_replace(template)

    return render_template_string(template)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=80)
