# How to add function examples

Starting at the website's root, you can find function examples by following the path
DOCS / Connect to RML / MORE EXAMPLES / Click here for more examples.

This renders file [rml/function-examples.md](rml/function-examples.md).

To add an example to that file, proceed as follows:

1. Copy comment `<!-- To uppercase -->` and the entire section `<section id="to-uppercase">` below it and paste these at the end of the file.
2. Adapt the new comment line, section id and all text in `Challenge` and `How to solve` to your example.
3. Try out your example in an environment with the YARRRML parser and the RMLMapper.
4. Put the contents of your final YARRRML file in the yaml code block in `Mapping file in YARRRML`.
5. Use the RML output of the YARRRML file as the basis for a beautified RML file. Beautify as follows:

   a. use [RML-SDK](https://gitlab.ilabt.imec.be/rml/util/rml-sdk) to nicely nest nodes. I used the following command line:

   ```shell
   node ./bin/rmlio.js rdf turtle -i ${RML_FILE} -o ${BEAUTIFIED_RML_FILE} -p -b \
   http://www.w3.org/ns/r2rml#subjectMap \
   http://www.w3.org/ns/r2rml#predicateObjectMap \
   http://www.w3.org/ns/r2rml#predicateMap \
   http://www.w3.org/ns/r2rml#objectMap \
   http://www.w3.org/ns/r2rml#joinCondition \
   http://semweb.mmlab.be/ns/fnml#functionValue
   ```

   b. Remove triples with `void:` predicates or objects like:

   ```turtle
   :rules_000 a void:Dataset;
     void:exampleResource :map_vegetables_000.
   ```

   c. Rename. For example, change `source_000` into `source-vegetables`, `map_vegetables_000` into `map-vegetables`.

   d. Delete irrelevant prefixes, for example `d2rq`, `void`, `dc`.

6. Test your beautified RML file.
7. Put the contents of your final RML file in the turtle code block in `Mapping file in RML`.
8. Put the output of RMLMapper in the turtle code block in `Mapping engine output`.
