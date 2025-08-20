---
layout: default
title: Function examples
---

<!-- Introduction -->
<section id="introduction">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h2>Introduction</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
{% renderTemplate "md" %}
Some general purpose functions are described in RDF at <https://users.ugent.be/~bjdmeest/function/grel.ttl> and <https://w3id.org/imec/idlab/function>.
Below we show how to discover some of them and use them in a mapping, written in [YARRRML](https://rml.io/yarrrml/) or [RML](https://rml.io/).
{% endrenderTemplate %}
            </div>
        </div>
    </div>
</section>

<!-- To uppercase -->
<section id="to-uppercase">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <h2>To uppercase</h2>
            </div>
            <div class="col-lg-12">
{% renderTemplate "md" %}
### Problem

Make a mapping to create triples `ex:id rdfs:label "LABEL"`, where `LABEL` is the uppercase-converted value of a `label` string in the input data.
The input data is in file `vegetables.csv`, with example content:

```csv
id,label
1,BEAN
2,Carrot
3,salad
```

### How to solve

Search for a function "to uppercase" and find out the RDF terms to use in a mapping.

At <https://users.ugent.be/~bjdmeest/function/grel.ttl> we find:

* The declaration of function `grel:toUpperCase`

```turtle
grel:toUpperCase
    a                   fno:Function ;
    fno:name            "to Uppercase" ;
    rdfs:label          "to Uppercase" ;
    dcterms:description "Returns the input with all letters in upper case." ;
    fno:solves          grel:prob_ucase ;
    fno:expects         ( grel:valueParam ) ;
    fno:returns         ( grel:stringOut ) .
```

* The declaration of parameter `grel:valueParam`

```turtle
grel:valueParam
    a             fno:Parameter ;
    fno:name      "input value" ;
    rdfs:label    "input value" ;
    fno:predicate grel:valueParameter ;
    fno:type      xsd:string ;
    fno:required  "true"^^xsd:boolean .
```

* The declaration of the return value `grel:stringOut`

```turtle
grel:stringOut
    a             fno:Output ;
    fno:name      "output string" ;
    rdfs:label    "output string" ;
    fno:predicate grel:stringOutput ;
    fno:type      xsd:string .
```

### Solution

* Mapping in YARRRML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```yaml
prefixes:
  ex: http://www.example.com/data/
  grel: http://users.ugent.be/~bjdmeest/function/grel.ttl#
  rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns#
  rdfs: http://www.w3.org/2000/01/rdf-schema#

mappings:
  vegetables:
    sources:
      - ['vegetables.csv~csv']
    s:
      value: ex:$(id)
    po:
      - p: rdfs:label
        o:
          function: grel:toUpperCase
          parameters:
            - [grel:valueParameter, $(label)]
```

* Mapping in RML

<!-- next two lines needed for correct rendering, maybe some bug in the eleventy version used -->
{% endrenderTemplate %}
{% renderTemplate "md" %}

```turtle
@prefix rr: <http://www.w3.org/ns/r2rml#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix fnml: <http://semweb.mmlab.be/ns/fnml#>.
@prefix fno: <https://w3id.org/function/ontology#>.
@prefix d2rq: <http://www.wiwiss.fu-berlin.de/suhl/bizer/D2RQ/0.1#>.
@prefix void: <http://rdfs.org/ns/void#>.
@prefix dc: <http://purl.org/dc/terms/>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix rml: <http://semweb.mmlab.be/ns/rml#>.
@prefix ql: <http://semweb.mmlab.be/ns/ql#>.
@prefix : <http://mapping.example.com/>.
@prefix ex: <http://www.example.com/data/>.
@prefix grel: <http://users.ugent.be/~bjdmeest/function/grel.ttl#>.

:rules_000 a void:Dataset;
    void:exampleResource :map_vegetables_000.
:map_vegetables_000 rml:logicalSource :source_000.
:source_000 a rml:LogicalSource;
    rml:source "vegetables.csv";
    rml:referenceFormulation ql:CSV.
:map_vegetables_000 a rr:TriplesMap;
    rdfs:label "vegetables".
:s_000 a rr:SubjectMap.
:map_vegetables_000 rr:subjectMap :s_000.
:s_000 rr:template "http://www.example.com/data/{id}".
:pom_000 a rr:PredicateObjectMap.
:map_vegetables_000 rr:predicateObjectMap :pom_000.
:pm_000 a rr:PredicateMap.
:pom_000 rr:predicateMap :pm_000.
:pm_000 rr:constant rdfs:label.
:pom_000 rr:objectMap :om_000.
:om_000 a fnml:FunctionTermMap;
    rr:termType rr:Literal;
    fnml:functionValue :fn_000.
:fn_000 rml:logicalSource :source_000;
    rr:predicateObjectMap :pomexec_000.
:pomexec_000 rr:predicateMap :pmexec_000.
:pmexec_000 rr:constant fno:executes.
:pomexec_000 rr:objectMap :omexec_000.
:omexec_000 rr:constant "http://users.ugent.be/~bjdmeest/function/grel.ttl#toUpperCase";
    rr:termType rr:IRI.
:fn_000 rr:predicateObjectMap :pom_001.
:pom_001 a rr:PredicateObjectMap;
    rr:predicateMap :pm_001.
:pm_001 a rr:PredicateMap;
    rr:constant grel:valueParameter.
:pom_001 rr:objectMap :om_001.
:om_001 a rr:ObjectMap;
    rml:reference "label";
    rr:termType rr:Literal.
```

{% endrenderTemplate %}
            </div>
        </div>
    </div>
</section>
